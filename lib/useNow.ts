"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * The instant the static HTML was authored for. It reproduces the reference
 * frame exactly (06:28 Los Angeles / 09:28 New York / 14:28 London / 17:28
 * Dubai / 22:28 Tokyo, Sun 04 Oct), and gives the server and the first client
 * render an identical value so hydration never mismatches.
 */
const SERVER_TIME = Date.parse("2026-10-04T13:28:00Z");

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

/** Snapshot used for the server render and for the first client render. */
function getServerSnapshot() {
  return SERVER_TIME;
}

/**
 * A clock that ticks once a second and stays in sync with the wall clock.
 *
 * `useSyncExternalStore` guarantees the server markup and the first client
 * render agree, then hands over to the live clock right after hydration.
 */
export function useNow(): Date {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => new Date(ms), [ms]);
}
