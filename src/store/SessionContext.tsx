import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { getOrInitDeviceId } from '@/utils/deviceId';
import { createSession, updateSession } from '@/services/api'; // CHANGE: ensure updateSession is exported

// Dev-safe logger
const devLog = (..._args: any[]) => {
  if (__DEV__) {
    try { (global as any).console?.log?.(..._args); } catch { 
// ignore
     } 
  }
};
const devError = (..._args: any[]) => {
  if (__DEV__) {
    try { (global as any).console?.error?.(..._args); } catch { 
// ignore
     } 
  }
};

interface ActiveSessionState {
  active: boolean;
  steps: number;
  startTime: number | null;
  deviceId: string | null;
  sessionId: string | null; // CHANGE: keep sessionId
  paused?: boolean;
}

interface SessionContextValue extends ActiveSessionState {
  start: () => Promise<void>;
  stopAndSave: (answer?: 'Bra' | 'Okej' | 'Dåligt') => Promise<{ ok: boolean; error?: string }>;
  elapsedSec: number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
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
  });
  const [elapsedSec, setElapsedSec] = useState(0);
  const pedometerSub = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseStepsRef = useRef(0);

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
    if (state.active) return;

    const perm = await Pedometer.requestPermissionsAsync();
    if (perm.status !== 'granted') throw new Error('Steg-behörighet nekad');

    const startTime = Date.now();
    baseStepsRef.current = 0;

    setState((s) => ({
      ...s,
      active: true,
      steps: 0,
      startTime,
      paused: false,
      // CHANGE: behåll tidigare deviceId, nollställ sessionId tills backend svarar
      deviceId: s.deviceId,
      sessionId: null,
    }));

    setElapsedSec(0);
    subscribePedometer();
    timerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // CHANGE: skapa tom session direkt (om vi har deviceId)
    const deviceId = state.deviceId;
    if (deviceId) {
      try {
        const newSession = await createSession({
          deviceId,
          steps: 0,
          time: 0,
          answer: 'Okej',
          reflection: '',
        } as any);
        devLog('[Session] New session created', newSession);
        setState((s) => ({ ...s, sessionId: newSession?._id ?? null }));
      } catch (e) {
        devError('[Session] Failed to create session at start', e);
        // Låt promenaden fortsätta lokalt ändå.
      }
    }
  };

  const stopAndSave = async (
    answer: 'Bra' | 'Okej' | 'Dåligt' = 'Okej'
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
    const newStart = Date.now() - elapsedSec * 1000;
    baseStepsRef.current = state.steps;
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

  return (
    <SessionContext.Provider
      value={{ ...state, start, stopAndSave, elapsedSec, pause, resume, reset }}
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