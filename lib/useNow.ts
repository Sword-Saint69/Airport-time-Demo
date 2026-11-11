"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let lastNotifiedSecond = -1;

function tick() {
  const second = Math.floor(Date.now() / 1000);
  if (second === lastNotifiedSecond) return;
  lastNotifiedSecond = second;
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (timer === null) {
    timer = setInterval(tick, 200);
    tick();
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Live snapshot: the current wall clock, truncated to whole seconds. */
function getSnapshot() {
  return Math.floor(Date.now() / 1000) * 1000;
}

/**
 * A clock that ticks once a second and stays in sync with the wall clock.
 *
 * `useSyncExternalStore` guarantees that the server markup and the first
 * client render agree — both use `initialMs`, the instant the server
 * rendered the page — and then hands over to the live clock immediately
 * after hydration.
 */
export function useNow(initialMs: number): Date {
  const getServerSnapshot = useCallback(() => initialMs, [initialMs]);
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => new Date(ms), [ms]);
}
