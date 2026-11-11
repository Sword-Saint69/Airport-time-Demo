"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  IconClockFace,
  IconDotGrid,
  IconDotSquare,
  IconLifebuoy,
  IconMinus,
  IconNext,
  IconPause,
  IconPlay,
  IconPlus,
  IconPrev,
  IconQueue,
  IconShuffle,
  IconSpeaker,
  IconSphere,
} from "@/components/Icons";
import { LOFI_TRACKS, type LoFiState } from "@/lib/lofi";

export type BoardColor = "lime" | "yellow" | "white" | "charcoal" | "ice";

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
  { id: "lime", label: "Pastel Lime", value: "#d8f582", dim: "#272a21", bg: "#151613" },
  { id: "yellow", label: "Warm Yellow", value: "#fae27c", dim: "#33301f", bg: "#1a1712" },
  { id: "white", label: "White", value: "#ffffff", dim: "#2e2e33", bg: "#0f0f11" },
  { id: "charcoal", label: "Dark Charcoal", value: "#262626", dim: "#d6d6da", bg: "#ececed" },
  { id: "ice", label: "Ice Blue", value: "#cce0ff", dim: "#232a33", bg: "#12151a" },
];

export type SoundMode = "mute" | "system" | "watch";
export type BoardMode = "digital" | "fids";

const SOUND_MODES: { value: SoundMode; label: string }[] = [
  { value: "mute", label: "Mute" },
  { value: "system", label: "System" },
  { value: "watch", label: "Watch" },
];

/** A full-width pill slider: a 36px track with a rounded fill. */
function PillSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-3.5">
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#7c7c80]"
        >
          {label}
        </label>
        <span className="text-[10px] tabular-nums text-[#7c7c80]">{value}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="wt-pill-range"
        style={{ ["--fill" as string]: `${value}%` }}
      />
    </div>
  );
}

export interface PreferencesPanelProps {
  open: boolean;
  boardMode: BoardMode;
  onBoardModeChange: (mode: BoardMode) => void;
  color: BoardColor;
  onColorChange: (color: BoardColor) => void;
  sound: SoundMode;
  onSoundChange: (sound: SoundMode) => void;
  /** system / watch tone volume, 0-100 */
  volume: number;
  onVolumeChange: (volume: number) => void;
  /** lo-fi player volume, 0-100 */
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
  /** current lo-fi player state */
  music: LoFiState;
  onMusicToggle: () => void;
  onMusicNext: () => void;
  onMusicPrevious: () => void;
  onMusicShuffle: () => void;
  onMusicSelect: (index: number) => void;
  onClose: () => void;
}

/**
 * The SYSTEM PREFERENCES drawer.
 *
 * A fixed 276px panel on the left with the clock-face card, the lo-fi
 * player, the theme swatches, the sound system and the brand footer.
 */
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
  musicVolume,
  onMusicVolumeChange,
  music,
  onMusicToggle,
  onMusicNext,
  onMusicPrevious,
  onMusicShuffle,
  onMusicSelect,
  onClose,
}: PreferencesPanelProps) {
  const [soundOpen, setSoundOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const track = LOFI_TRACKS[music.trackIndex] ?? LOFI_TRACKS[0];

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="drawer"
          initial={{ opacity: 0, x: -26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed left-3 top-3 z-50 flex h-[calc(100dvh_-_24px)] w-[276px] flex-col overflow-hidden rounded-2xl border border-[#262626] bg-[#181818] text-[#e9e9ec] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.8)]"
          aria-label="System preferences"
        >
          {/* header */}
          <header className="flex shrink-0 items-center justify-between px-4 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <IconDotSquare size={13} className="text-[#9a9a9a]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9a9a9a]">
                System Preferences
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close system preferences"
              className="grid h-6 w-6 place-items-center rounded-md text-[#9a9a9a] transition-colors hover:bg-[#242424] hover:text-white"
            >
              <IconMinus size={13} />
            </button>
          </header>

          {/* body */}
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-3">
            {/* clock face */}
            <button
              type="button"
              onClick={() => onBoardModeChange(boardMode === "fids" ? "digital" : "fids")}
              aria-label={`Clock face, ${
                boardMode === "fids" ? "FIDS" : "Digital"
              } rendering. Switch rendering.`}
              className="flex items-center gap-3 rounded-xl bg-[#222222] p-3.5 text-left transition-colors hover:bg-[#262626]"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[#1d7dfa] text-white">
                <IconClockFace size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium leading-tight text-white">
                  Clock Face
                </span>
                <span className="mt-0.5 block text-[11px] leading-tight text-[#8a8a8e]">
                  {boardMode === "fids" ? "FIDS" : "Digital"}
                </span>
              </span>
            </button>

            {/* lo-fi player */}
            <div className="rounded-xl bg-[#222222] p-3.5">
              <div className="flex items-center gap-3">
                <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#2f4574] via-[#1b2743] to-[#0b0f18]">
                  <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/45" />
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#6ea8ff]/25 to-transparent" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium leading-tight text-white">
                    {track.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] leading-tight text-[#8a8a8e]">
                    {track.artist}
                  </p>
                </div>
              </div>

              <div className="my-3 h-px bg-[#2e2e2e]" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={onMusicPrevious}
                    aria-label="Previous track"
                    className="text-white/90 transition-opacity hover:opacity-70"
                  >
                    <IconPrev size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={onMusicToggle}
                    aria-label={music.playing ? "Pause" : "Play"}
                    className="text-white transition-opacity hover:opacity-70"
                  >
                    {music.playing ? <IconPause size={16} /> : <IconPlay size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={onMusicNext}
                    aria-label="Next track"
                    className="text-white/90 transition-opacity hover:opacity-70"
                  >
                    <IconNext size={15} />
                  </button>
                </div>
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={onMusicShuffle}
                    aria-label="Shuffle"
                    aria-pressed={music.shuffle}
                    className={
                      music.shuffle
                        ? "text-white transition-opacity hover:opacity-70"
                        : "text-[#5f5f63] transition-colors hover:text-[#8a8a8e]"
                    }
                  >
                    <IconShuffle size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueOpen((v) => !v)}
                    aria-label="Queue"
                    aria-expanded={queueOpen}
                    className={
                      queueOpen
                        ? "text-white transition-opacity hover:opacity-70"
                        : "text-[#5f5f63] transition-colors hover:text-[#8a8a8e]"
                    }
                  >
                    <IconQueue size={15} />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {queueOpen ? (
                  <motion.ul
                    key="queue"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="my-3 h-px bg-[#2e2e2e]" />
                    {LOFI_TRACKS.map((t, i) => (
                      <li key={t.title}>
                        <button
                          type="button"
                          onClick={() => onMusicSelect(i)}
                          className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-[#2a2a2a] ${
                            i === music.trackIndex ? "text-white" : "text-[#8a8a8e]"
                          }`}
                        >
                          <span className="truncate text-[11px]">{t.title}</span>
                          {i === music.trackIndex && music.playing ? (
                            <span className="ml-auto flex h-2.5 items-end gap-[2px]">
                              <span className="w-[2px] origin-bottom animate-[wt-eq_900ms_ease-in-out_infinite] bg-white/80" style={{ height: "60%" }} />
                              <span className="w-[2px] origin-bottom animate-[wt-eq_900ms_ease-in-out_infinite_120ms] bg-white/80" style={{ height: "100%" }} />
                              <span className="w-[2px] origin-bottom animate-[wt-eq_900ms_ease-in-out_infinite_240ms] bg-white/80" style={{ height: "45%" }} />
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </div>

            {/* theme swatches */}
            <div
              role="radiogroup"
              aria-label="Theme"
              className="flex items-center gap-2 px-0.5 pt-0.5"
            >
              {BOARD_COLORS.map((swatch) => {
                const active = swatch.id === color;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    role="radio"
                    title={swatch.label}
                    aria-label={swatch.label}
                    aria-checked={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => onColorChange(swatch.id)}
                    className={`h-7 w-[38px] rounded-lg transition-transform duration-200 ${
                      active ? "scale-105" : "hover:scale-[1.04]"
                    }`}
                    style={{
                      background: swatch.value,
                      boxShadow: active
                        ? "0 0 0 2px #181818, 0 0 0 3.5px #9a9a9a"
                        : "0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  />
                );
              })}
            </div>

            {/* sound system */}
            <section className="rounded-xl border border-[#262626]">
              <button
                type="button"
                onClick={() => setSoundOpen((v) => !v)}
                aria-expanded={soundOpen}
                className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
              >
                <IconSpeaker size={15} className="shrink-0 text-[#9a9a9a]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                  Sound System
                </span>
                <span className="ml-auto grid h-5 w-5 place-items-center rounded text-[#8a8a8e]">
                  {soundOpen ? <IconMinus size={12} /> : <IconPlus size={12} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {soundOpen ? (
                  <motion.div
                    key="sound"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5">
                      <div
                        role="radiogroup"
                        aria-label="Sound output"
                        className="flex gap-[3px] rounded-lg bg-[#222222] p-[3px]"
                      >
                        {SOUND_MODES.map((mode) => {
                          const active = sound === mode.value;
                          return (
                            <button
                              key={mode.value}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              tabIndex={active ? 0 : -1}
                              onClick={() => onSoundChange(mode.value)}
                              className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition-colors ${
                                active
                                  ? "bg-[#141414] text-white"
                                  : "text-[#8a8a8e] hover:text-[#c9c9cc]"
                              }`}
                            >
                              {mode.label}
                            </button>
                          );
                        })}
                      </div>

                      <PillSlider
                        id="pref-system-volume"
                        label="System"
                        value={volume}
                        onChange={onVolumeChange}
                      />
                      <PillSlider
                        id="pref-music-volume"
                        label="Music"
                        value={musicVolume}
                        onChange={onMusicVolumeChange}
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>

            {/* discover more */}
            <section className="rounded-xl border border-[#262626]">
              <button
                type="button"
                onClick={() => setDiscoverOpen((v) => !v)}
                aria-expanded={discoverOpen}
                className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
              >
                <IconDotGrid size={15} className="shrink-0 text-[#9a9a9a]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                  Discover more by CO.
                </span>
                <span className="ml-auto grid h-5 w-5 place-items-center rounded text-[#8a8a8e]">
                  {discoverOpen ? <IconMinus size={12} /> : <IconPlus size={12} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {discoverOpen ? (
                  <motion.div
                    key="discover"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5">
                      <p className="text-[11px] leading-snug text-[#8a8a8e]">
                        Off-Time — Gallery Companion. Recall memories, clean
                        photos.
                      </p>
                      <button
                        type="button"
                        className="mt-2.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#111113] transition-transform active:scale-95"
                      >
                        Get the app
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>

            {/* support */}
            <section className="rounded-xl border border-[#262626]">
              <button
                type="button"
                onClick={() => setSupportOpen((v) => !v)}
                aria-expanded={supportOpen}
                className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
              >
                <IconLifebuoy size={15} className="shrink-0 text-[#9a9a9a]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                  Support
                </span>
                <span className="ml-auto grid h-5 w-5 place-items-center rounded text-[#8a8a8e]">
                  {supportOpen ? <IconMinus size={12} /> : <IconPlus size={12} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {supportOpen ? (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5 text-[11px] leading-snug text-[#8a8a8e]">
                      Questions, bugs and feature requests — send them to
                      hello@co.watch and we will get back to you.
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>
          </div>

          {/* pinned brand footer */}
          <footer className="shrink-0 border-t border-[#232323] px-4 pb-3.5 pt-3 text-center">
            <IconSphere size={26} className="mx-auto" />
            <p className="mt-2 text-[10px] text-[#999999]">
              Co&apos;Watch!. All rights reserved.
            </p>
            <p className="text-[10px] text-[#666666]">V0.9.2 / Made by Co.</p>
          </footer>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
