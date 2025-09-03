// src/components/StopWatch.tsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';

type Props = {
  autoStart?: boolean;                    // starta automatiskt (default: false)
  onStop?: (elapsedMs: number) => void;   // callback när man stoppar
  onSecondTick?: (elapsedMs: number) => void; // tick varje sekund (för t.ex. byta fråga)
  testID?: string;
};

export default function StopWatch({ autoStart = false, onStop, onSecondTick, testID }: Props) {
  const [running, setRunning] = useState(autoStart);
  const [elapsed, setElapsed] = useState(0); // ms
  const baseElapsedRef = useRef(0);          // ackumulerat under pauser
  const startedAtRef = useRef<number | null>(null); // Date.now() när startade
  const lastSecondRef = useRef<number>(0);

  // Starta/pausa/stopp
const start = useCallback(() => {
  if (running) return;
  startedAtRef.current = Date.now();
  setRunning(true);
}, [running]);

const pause = useCallback(() => {
  if (!running) return;
  const now = Date.now();
  if (startedAtRef.current) {
    baseElapsedRef.current += now - startedAtRef.current;
    startedAtRef.current = null;
  }
  setRunning(false);
  setElapsed(baseElapsedRef.current);
}, [running]);

const stop = useCallback(() => {
  pause();
  onStop?.(baseElapsedRef.current);
}, [pause, onStop]);

const reset = useCallback(() => {
  setRunning(false);
  startedAtRef.current = null;
  baseElapsedRef.current = 0;
  lastSecondRef.current = 0;
  setElapsed(0);
}, []);

  // Huvudtimer – låg drift via Date.now() (inte beroende av setInterval-drifts)
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const now = Date.now();
      const live = baseElapsedRef.current + (startedAtRef.current ? now - startedAtRef.current : 0);
      setElapsed(live);

      // Sekundtick (bara när hel sekund passerat)
      const sec = Math.floor(live / 1000);
      if (sec !== lastSecondRef.current) {
        lastSecondRef.current = sec;
        onSecondTick?.(live);
      }
    }, 250); // uppdatera 4 ggr/s för mjuk visning
    return () => clearInterval(id);
  }, [running, onSecondTick]);

  // Pausa när appen går i bakgrunden (skönt UX)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active' && running) pause();
    });
    return () => sub.remove();
  }, [running, pause]);

  useEffect(() => {
    if (autoStart) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hhmmss = useMemo(() => formatHMS(elapsed), [elapsed]);

  return (
    <View style={styles.wrap} testID={testID}>
      <Text style={styles.timer} accessibilityRole="timer" accessibilityLabel={`Tid ${hhmmss}`}>
        {hhmmss}
      </Text>

      <View style={styles.row}>
        {!running ? (
          <TouchableOpacity style={[styles.btn, styles.primary]} onPress={start}
            accessibilityRole="button" accessibilityLabel="Starta">
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={pause}
            accessibilityRole="button" accessibilityLabel="Pausa">
            <Text style={styles.btnText}>Pausa</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.btn, styles.danger]} onPress={stop}
          accessibilityRole="button" accessibilityLabel="Stoppa">
          <Text style={styles.btnText}>Stoppa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={reset}
          accessibilityRole="button" accessibilityLabel="Nollställ">
          <Text style={styles.btnText}>Nollställ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatHMS(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  timer: { fontSize: 36, fontWeight: '700', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 1, borderColor: '#304A76',
    minWidth: 90, alignItems: 'center',
  },
  primary: { backgroundColor: '#304A76' },
  secondary: { backgroundColor: '#ffffff' },
  danger: { backgroundColor: '#ffebeb', borderColor: '#c32222' },
  ghost: { backgroundColor: 'transparent', opacity: 0.8 },
  btnText: { color: '#304A76', fontWeight: 'bold' },
});