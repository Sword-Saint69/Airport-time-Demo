"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DotText } from "@/components/DotMatrix";
import { IconPause, IconPlay, IconReset } from "@/components/Icons";

const PRESETS = [5, 10, 15, 25, 45];

export interface FocusViewProps {
  /** Fires when a focus session starts or stops. */
  onSound?: (kind: "start" | "stop") => void;
}

/**
 * A focus timer rendered on the same LED board as the world clock.
 */
export function FocusView({ onSound }: FocusViewProps) {
  const [preset, setPreset] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const raf = useRef<number | null>(null);
  const deadline = useRef<number>(0);

  const total = preset * 60;

  const choosePreset = useCallback(
    (minutes: number) => {
      setPreset(minutes);
      setSecondsLeft(minutes * 60);
      setRunning(false);
      setCompleted(false);
    },
    [],
  );

  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + secondsLeft * 1000;
    const tick = () => {
      const remaining = Math.max(0, Math.round((deadline.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        setRunning(false);
        setCompleted(true);
        onSound?.("stop");
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const toggle = useCallback(() => {
    setCompleted(false);
    setRunning((r) => !r);
  }, []);

  // The tone fires from an effect so the state updater stays pure (React
  // StrictMode double-invokes updaters in development).
  const previousRunning = useRef(running);
  useEffect(() => {
    if (previousRunning.current === running) return;
    previousRunning.current = running;
    onSound?.(running ? "start" : "stop");
  }, [running, onSound]);

  const reset = useCallback(() => {
    setRunning(false);
    setCompleted(false);
    setSecondsLeft(total);
  }, [total]);

  const progress = useMemo(
    () => 1 - Math.min(1, Math.max(0, secondsLeft / total)),
    [secondsLeft, total],
  );

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const R = 168;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[clamp(14px,2.4vh,34px)] px-4">
      <div
        className="relative grid place-items-center"
        style={{
          width: "clamp(220px, 42vh, 420px)",
          height: "clamp(220px, 42vh, 420px)",
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle cx={200} cy={200} r={168} fill="none" stroke="var(--dot-dim)" strokeWidth={2} />
          <circle
            cx={200}
            cy={200}
            r={168}
            fill="none"
            stroke="var(--dot-lit)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 320ms linear" }}
          />
        </svg>

        <div className="relative flex flex-col items-center">
          <div className="flex items-end gap-[5px]">
            <DotText text={mm} unit={10} />
            <DotText text={":"} unit={10} />
            <DotText text={ss} unit={10} />
          </div>
          <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--fg-3)]">
            {completed ? "Complete" : running ? "Focusing" : "Paused"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            onClick={() => choosePreset(minutes)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium tabular-nums transition-colors ${
              preset === minutes
                ? "bg-[var(--glass-strong)] text-[var(--fg)]"
                : "bg-[var(--glass)] text-[var(--fg-2)] hover:text-[var(--fg)]"
            }`}
          >
            {minutes}m
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          aria-label="Reset timer"
          className="grid h-11 w-11 place-items-center rounded-full bg-[var(--glass)] text-[var(--fg-2)] transition-colors hover:text-[var(--fg)]"
        >
          <IconReset size={18} />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={running ? "Pause timer" : "Start timer"}
          className="grid h-14 w-14 place-items-center rounded-full bg-[var(--glass-strong)] text-[var(--fg)] transition-transform active:scale-95"
        >
          {running ? <IconPause size={22} /> : <IconPlay size={22} />}
        </button>
      </div>
    </div>
  );
}
