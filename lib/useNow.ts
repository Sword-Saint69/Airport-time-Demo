"use client";

import { useEffect, useState } from "react";

/**
 * A clock that ticks once a second and stays in sync with the wall clock.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let raf = 0;
    let timeout = 0;
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;
      setNow(new Date());
      timeout = window.setTimeout(schedule, intervalMs);
    };

    // Re-align to the next whole second so the displayed time never drifts.
    const delay = intervalMs - (Date.now() % intervalMs);
    timeout = window.setTimeout(schedule, delay);
    raf = requestAnimationFrame(() => {});

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [intervalMs]);

  return now;
}
