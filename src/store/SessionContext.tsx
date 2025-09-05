import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { getOrInitDeviceId } from '@/utils/deviceId';
import { createSession, updateSession } from '@/services/api'; // CHANGE: ensure updateSession is exported

// Dev-loggar (tyst i produktion)
const devLog = (..._args: any[]) => {
  if (!__DEV__) return;
  try {
    (global as any).console?.log?.(..._args);
  } catch {
    /* ignore */
  }
};
const devError = (..._args: any[]) => {
  if (!__DEV__) return;
  try {
    (global as any).console?.error?.(..._args);
  } catch {
    /* ignore */
  }
};

interface ActiveSessionState {
  active: boolean;
  steps: number;
  startTime: number | null;
  deviceId: string | null;
  sessionId: string | null; // backend id
  paused?: boolean;
  creatingSession?: boolean; // true mellan start() och svar från createSession
}

interface SessionContextValue extends ActiveSessionState {
  start: () => Promise<void>;
  stopAndSave: (answer?: 'Bra' | 'Okej' | 'Dåligt') => Promise<{ ok: boolean; error?: string }>;
  elapsedSec: number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finish: () => { steps: number; durationSec: number } | null;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ActiveSessionState>({
    active: false,
    steps: 0,
    startTime: null,
    deviceId: null,
    sessionId: null,
    paused: false,
    creatingSession: false,
  });
  const [elapsedSec, setElapsedSec] = useState(0);
  const pedometerSub = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseStepsRef = useRef(0); // ackumulerat över pauser
  const startingRef = useRef(false); // skyddar mot dubbelstart (snabba klick)
  // Hämta/initialisera deviceId en gång
  useEffect(() => {
    (async () => {
      const id = await getOrInitDeviceId();
      setState((s) => ({ ...s, deviceId: id }));
    })();
  }, []);

  const clearPedometer = () => {
    if (pedometerSub.current) {
      pedometerSub.current.remove();
      pedometerSub.current = null;
    }
  };
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
  };
  const subscribePedometer = () => {
    pedometerSub.current = Pedometer.watchStepCount((result) => {
      setState((s) => ({ ...s, steps: baseStepsRef.current + result.steps }));
    });
  };

  const start = async () => {
    // Förhindra dubbelstart (snabba klick innan render uppdaterat 'active')
    if (state.active || startingRef.current) return;
    startingRef.current = true;
    try {
      const perm = await Pedometer.requestPermissionsAsync();
      if (perm.status !== 'granted') throw new Error('Steg-behörighet nekad');

      // Säkerställ deviceId (om inte redan satt av init effect)
      let deviceId = state.deviceId;
      if (!deviceId) {
        deviceId = await getOrInitDeviceId();
        setState((s) => ({ ...s, deviceId }));
      }

      const startTime = Date.now();
      baseStepsRef.current = 0;
      setState((s) => ({
        ...s,
        active: true,
        steps: 0,
        startTime,
        paused: false,
        sessionId: null,
      }));
      setElapsedSec(0);
      subscribePedometer();
      timerRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Skapa placeholder-session (idempotent skydd mot dubbletter via guard ovan)
      if (deviceId) {
        setState((s) => ({ ...s, creatingSession: true }));
        try {
          const newSession = await createSession({
            deviceId,
            steps: 0,
            time: 0,
            answer: 'Okej',
            reflection: '',
          } as any);
          devLog('[Session] New session created', newSession);
          setState((s) => ({ ...s, sessionId: newSession?._id ?? null, creatingSession: false }));
        } catch (e) {
          devError('[Session] Failed to create session at start', e);
          setState((s) => ({ ...s, creatingSession: false }));
        }
      }
    } finally {
      startingRef.current = false;
    }
  };

  const stopAndSave = async (
    answer: 'Bra' | 'Okej' | 'Dåligt' = 'Okej',
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!state.active || !state.startTime || !state.deviceId) {
      return { ok: false, error: 'Ingen aktiv session' };
    }

    clearPedometer();
    clearTimer();

    const durationSec = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
    const steps = Number.isFinite(state.steps) ? state.steps : 0;

    try {
      if (state.sessionId) {
        // CHANGE: uppdatera befintlig session
        const res = await updateSession(state.sessionId, {
          steps,
          time: durationSec,
          answer,
          date: new Date().toISOString(),
        } as any);
        devLog('[Session] Updated session', res);
      } else {
        // CHANGE: fallback – skapa session vid stop om start misslyckades
        const res = await createSession({
          deviceId: state.deviceId,
          steps,
          time: durationSec,
          answer,
          reflection: '',
          date: new Date().toISOString(),
        } as any);
        devLog('[Session] Created session on stop (fallback)', res);
      }

      // CHANGE: nollställ lokalt (inkl startTime, paused, sessionId)
      setState((s) => ({
        ...s,
        active: false,
        steps: 0,
        startTime: null,
        paused: false,
        sessionId: null,
      }));
      setElapsedSec(0);

      return { ok: true };
    } catch (e: any) {
      devError('[Session] Save error', e?.response?.data || e);
      return { ok: false, error: e?.message || 'Kunde inte spara session' };
    }
  };

  const pause = () => {
    if (!state.active || state.paused) return;
    clearPedometer();
    clearTimer();
    setState((s) => ({ ...s, paused: true }));
  };

  const resume = () => {
    if (!state.active || !state.paused) return;
    const newStart = Date.now() - elapsedSec * 1000; // justera startTime
    baseStepsRef.current = state.steps; // spara ackumulerade steg
    subscribePedometer();
    timerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - newStart) / 1000));
    }, 1000);
    setState((s) => ({ ...s, paused: false, startTime: newStart }));
  };

  const reset = () => {
    if (!state.active) return;
    clearPedometer();
    clearTimer();
    const startTime = Date.now();
    baseStepsRef.current = 0;
    setState((s) => ({ ...s, steps: 0, startTime, paused: false }));
    setElapsedSec(0);
    subscribePedometer();
    timerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearPedometer();
      clearTimer();
    };
  }, []);

  // Avsluta utan att spara – returnerar en sammanfattning för LogWalk-skärmen
  const finish = (): { steps: number; durationSec: number } | null => {
    if (!state.active || !state.startTime) return null;

    // Stoppa sensorer/timer
    clearPedometer();
    clearTimer();

    const durationSec = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
    const steps = Number.isFinite(state.steps) ? state.steps : 0;

    // Markera sessionen som inaktiv men behåll steps & sessionId (behövs ev. för PUT)
    setState((s) => ({
      ...s,
      active: false,
      paused: false,
      startTime: null,
    }));

    return { steps, durationSec };
  };

  return (
    <SessionContext.Provider
      value={{ ...state, start, stopAndSave, elapsedSec, pause, resume, reset, finish }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
};
