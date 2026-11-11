"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Segmented } from "@/components/Segmented";
import { IconCoffee } from "@/components/Icons";

export type BoardColor = "white" | "black" | "green" | "yellow" | "blue";

export const BOARD_COLORS: {
  id: BoardColor;
  label: string;
  /** colour of the lit dots */
  value: string;
  /** colour of the unlit dots */
  dim: string;
  /** canvas background behind the board */
  bg: string;
}[] = [
  { id: "white", label: "White", value: "#f4f4f7", dim: "#2e2e33", bg: "#0f0f11" },
  { id: "black", label: "Black", value: "#16161a", dim: "#d6d6da", bg: "#ececed" },
  { id: "green", label: "Green", value: "#d8f582", dim: "#272a21", bg: "#151613" },
  { id: "yellow", label: "Yellow", value: "#ffd66b", dim: "#33301f", bg: "#1a1712" },
  { id: "blue", label: "Blue", value: "#a9d2ff", dim: "#232a33", bg: "#12151a" },
];

export type SoundMode = "mute" | "system" | "watch";
export type BoardMode = "digital" | "fids";

export interface PreferencesPanelProps {
  open: boolean;
  boardMode: BoardMode;
  onBoardModeChange: (mode: BoardMode) => void;
  color: BoardColor;
  onColorChange: (color: BoardColor) => void;
  sound: SoundMode;
  onSoundChange: (sound: SoundMode) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onClose: () => void;
}

export function PreferencesPanel({
  open,
  boardMode,
  onBoardModeChange,
  color,
  onColorChange,
  sound,
  onSoundChange,
  volume,
  onVolumeChange,
  onClose,
}: PreferencesPanelProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="panel"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ type: "spring", stiffness: 380, damping: 36 }}
          className="absolute left-0 top-0 z-30 flex h-full w-[min(300px,80vw)] flex-col gap-3.5 overflow-y-auto px-5 pb-6 pt-[clamp(58px,7vh,86px)] text-[var(--fg)]"
        >
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-3)]">
              System Preferences
            </h2>

            <Segmented
              layoutId="pref-board-mode"
              size="sm"
              label="Board rendering"
              value={boardMode}
              onChange={onBoardModeChange}
              className="w-fit"
              options={[
                { value: "digital", label: "Digital" },
                { value: "fids", label: "FIDS" },
              ]}
            />

            <div className="flex items-center gap-3">
              {BOARD_COLORS.map((swatch) => {
                const active = swatch.id === color;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    title={swatch.label}
                    aria-label={swatch.label}
                    aria-pressed={active}
                    onClick={() => onColorChange(swatch.id)}
                    className={`h-9 w-9 rounded-full transition-transform duration-200 ${
                      active ? "scale-110" : "hover:scale-105"
                    }`}
                    style={{
                      background: swatch.value,
                      boxShadow: active
                        ? "0 0 0 2px var(--bg), 0 0 0 3.5px var(--fg-3)"
                        : "0 0 0 1px rgba(140,140,150,0.4)",
                    }}
                  />
                );
              })}
            </div>

            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-3)]">
              Sound
            </h3>

            <Segmented
              layoutId="pref-sound"
              size="sm"
              label="Sound output"
              value={sound}
              onChange={onSoundChange}
              options={[
                { value: "mute", label: "Mute" },
                { value: "system", label: "System" },
                { value: "watch", label: "Watch" },
              ]}
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <label htmlFor="volume" className="sr-only">
                  Volume
                </label>
                <input
                  id="volume"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="wt-range flex-1"
                  style={{ ["--fill" as string]: `${volume}%` }}
                />
                <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[var(--fg)]">
                  {volume}%
                </span>
              </div>
            </div>

            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-3)]">
              Support
            </h3>

            <a
              href="#support"
              onClick={(e) => e.preventDefault()}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-[#111113] transition-transform active:scale-95"
            >
              <IconCoffee size={16} />
              Buy me a coffee
            </a>

            <h3 className="mt-1 text-[13px] font-bold tracking-[0.02em] text-[var(--fg)]">
              CO&apos;WATCH!
            </h3>
            <p className="-mt-2 text-[11px] text-[var(--fg-3)]">Discover more by CO.</p>

            <div className="flex flex-col gap-2.5 rounded-2xl bg-[var(--card)] p-3 backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-[#2b3550] to-[#0d1119]">
                  <span className="block h-3 w-3 rounded-[3px] bg-[conic-gradient(from_210deg,#ff5f6d,#ffc371,#47e0b0,#4facfe,#ff5f6d)]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold leading-tight">
                    Off-Time - Gallery Companion.
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-[var(--fg-3)]">
                    Recall Memories, Clean Photos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#111113] transition-transform active:scale-95"
              >
                Get the app
              </button>
            </div>
          </motion.aside>
        ) : null}
    </AnimatePresence>
  );
}
