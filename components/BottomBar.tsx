"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { IconSearch } from "@/components/Icons";
import { Segmented } from "@/components/Segmented";
import type { City } from "@/lib/cities";
import { searchCities } from "@/lib/cities";
import { formatShortDate, getGmtOffset, isDaytime } from "@/lib/time";

export interface BottomBarProps {
  view: "clock" | "map";
  onViewChange: (view: "clock" | "map") => void;
  location: City;
  now: Date;
  onPickCity: (city: City) => void;
  /** Hides the bar (expanded presentation mode). */
  hidden?: boolean;
  /** The preferences drawer is open — the view switch steps aside. */
  preferencesOpen?: boolean;
}

export function BottomBar({
  view,
  onViewChange,
  location,
  now,
  onPickCity,
  hidden = false,
  preferencesOpen = false,
}: BottomBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const offset = useMemo(() => getGmtOffset(location, now), [location, now]);
  const suggestions = useMemo(() => (open ? searchCities(query, 7) : []), [open, query]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (city: City) => {
    onPickCity(city);
    setQuery("");
    setOpen(false);
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? 24 : 0, pointerEvents: hidden ? "none" : "auto" }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-[clamp(12px,1.6vw,28px)] pb-[clamp(12px,1.6vw,28px)]"
    >
      {preferencesOpen ? (
        <div className="pointer-events-auto" />
      ) : (
        <div className="pointer-events-auto">
          <Segmented
            layoutId="bottom-view"
            size="sm"
            label="Board view"
            value={view}
            onChange={onViewChange}
            options={[
              { value: "clock", label: "Clock" },
              { value: "map", label: "Map" },
            ]}
          />
        </div>
      )}

      <div className="pointer-events-auto relative flex flex-1 justify-center">
        <AnimatePresence>
          {open ? (
            <motion.div
              key="popover"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", duration: 0.42, bounce: 0.14 }}
              style={{ transformOrigin: "bottom center" }}
              className="absolute bottom-[calc(100%+10px)] left-1/2 w-[min(360px,86vw)] -translate-x-1/2 overflow-hidden rounded-2xl bg-[var(--bg-elev)]/95 p-1.5 shadow-[var(--shadow-panel)] backdrop-blur-2xl"
            >
              {suggestions.length > 0 ? (
                <ul className="flex flex-col">
                  {suggestions.map((city, i) => {
                    const gmt = getGmtOffset(city, now);
                    const day = isDaytime(city.timeZone, now);
                    return (
                      <motion.li
                        key={city.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.23, 1, 0.32, 1],
                          delay: i * 0.035,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => pick(city)}
                          className="wt-press flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors duration-200 hover:bg-[var(--glass)]"
                        >
                          <span className="shrink-0 text-[12px]" aria-hidden="true">
                            {day ? "☀️" : "🌙"}
                          </span>
                          <span className="truncate text-[13px] font-semibold">{city.name}</span>
                          <span className="truncate text-[12px] text-[var(--fg-2)]">
                            {city.country}
                          </span>
                          <span className="ml-auto shrink-0 text-[11px] tabular-nums text-[var(--fg-3)]">
                            {gmt.label}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-3 py-3 text-[12px] text-[var(--fg-3)]">No matching cities</p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div
          className={`wt-lift flex h-9 items-center gap-2 rounded-full bg-[var(--glass)] px-3.5 backdrop-blur-xl transition-colors duration-200 ${
            open ? "bg-[var(--glass-strong)]" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Search cities"
            className="wt-press text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--fg)]"
          >
            <IconSearch size={16} />
          </button>
          {open ? (
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City"
              spellCheck={false}
              autoComplete="off"
              className="w-[min(180px,40vw)] bg-transparent text-[13px] outline-none placeholder:text-[var(--fg-3)]"
            />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="whitespace-nowrap text-[13px] font-medium text-[var(--fg)]"
            >
              {location.name}
              <span className="ml-1.5 text-[var(--fg-3)]">· {offset.label}</span>
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-auto">
        <div className="whitespace-nowrap rounded-full bg-[var(--glass)] px-3.5 py-2 text-[13px] font-medium text-[var(--fg)] backdrop-blur-xl">
          {formatShortDate(now)}
        </div>
      </div>
    </motion.div>
  );
}
