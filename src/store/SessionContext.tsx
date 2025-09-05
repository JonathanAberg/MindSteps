import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { getOrInitDeviceId } from '@/utils/deviceId';
import { createSession } from '@/services/api';

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
  paused?: boolean;
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
    paused: false,
  });
  const [elapsedSec, setElapsedSec] = useState(0);
  const pedometerSub = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseStepsRef = useRef(0); // ackumulerat över pauser
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
      // result.steps är sedan subscription start. Lägg på basvärde.
      setState((s) => ({ ...s, steps: baseStepsRef.current + result.steps }));
    });
  };

  const start = async () => {
    if (state.active) return;
    const perm = await Pedometer.requestPermissionsAsync();
    if (perm.status !== 'granted') {
      throw new Error('Steg-behörighet nekad');
    }
    const startTime = Date.now();
    baseStepsRef.current = 0;
    setState({ active: true, steps: 0, startTime, deviceId: state.deviceId, paused: false });
    setElapsedSec(0);
    subscribePedometer();

    timerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };

  const stopAndSave = async (
    answer: 'Bra' | 'Okej' | 'Dåligt' = 'Okej',
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!state.active || !state.startTime || !state.deviceId) {
      return { ok: false, error: 'Ingen aktiv session' };
    }

    clearPedometer();
    clearTimer();
    // simulation removed

    const durationSec = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
    const payload = {
      steps: Number.isFinite(state.steps) ? state.steps : 0,
      time: Number.isFinite(durationSec) ? durationSec : 1,
      answer,
      deviceId: state.deviceId,
      date: new Date().toISOString(), // in case backend expects date
    } as const;

    // Debug log (kan tas bort i produktion)
    devLog('[Session] Creating session payload', payload);

    try {
      const res = await createSession(payload as any);
      devLog('[Session] Create session response', res);
      setState({
        active: false,
        steps: 0,
        startTime: null,
        deviceId: state.deviceId,
        paused: false,
      });
      setElapsedSec(0);
      return { ok: true };
    } catch (e: any) {
      devError('[Session] Create session error', e?.response?.data || e);
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

  useEffect(
    () => () => {
      clearPedometer();
      clearTimer();
      // simulation removed
    },
    [],
  );

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
