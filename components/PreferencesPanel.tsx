"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { BoardLayout } from "@/components/BoardLayout";
import {
  IconClock24,
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
import {
  BOARD_COLORS,
  DEFAULT_BOARD_COLOR,
  paletteFor,
  themeFor,
  type BoardColor,
} from "@/lib/theme";

export type { BoardColor } from "@/lib/theme";
export { BOARD_COLORS } from "@/lib/theme";
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

/** The +/- glyph in an accordion header: the plus rotates away as the minus rotates in. */
function AccordionGlyph({ open }: { open: boolean }) {
  const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
  return (
    <span className="relative ml-auto grid h-5 w-5 place-items-center text-[#8a8a8e]">
      <IconPlus
        size={12}
        className={`absolute transition-all duration-200 ease-[${ease}] ${
          open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <IconMinus
        size={12}
        className={`absolute transition-all duration-200 ease-[${ease}] ${
          open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
        }`}
      />
    </span>
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
  /** whether times are shown on a 24-hour clock */
  hour24: boolean;
  onHour24Change: (hour24: boolean) => void;
  /** the board layout editor */
  boardLayout: React.ComponentProps<typeof BoardLayout>;
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
  hour24,
  onHour24Change,
  boardLayout,
  onClose,
}: PreferencesPanelProps) {
  const [soundOpen, setSoundOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const track = LOFI_TRACKS[music.trackIndex] ?? LOFI_TRACKS[0];
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="drawer"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: {
              opacity: 0,
              x: reduceMotion ? 0 : -24,
              // Exits are always faster than entrances.
              transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] },
            },
            visible: {
              opacity: 1,
              x: 0,
              transition: { type: "spring", duration: 0.5, bounce: 0.12 },
            },
          }}
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
              className="wt-press flex items-center gap-3 rounded-xl bg-[#222222] p-3.5 text-left transition-colors duration-200 hover:bg-[#262626]"
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
                    className="wt-press text-white/90 transition-opacity duration-200 hover:opacity-70"
                  >
                    <IconPrev size={15} />
                  </button>
                  <span className="relative grid place-items-center">
                    {music.playing ? (
                      <span
                        aria-hidden="true"
                        className="wt-pulse-ring pointer-events-none absolute inset-0 rounded-full border border-white/40"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={onMusicToggle}
                      aria-label={music.playing ? "Pause" : "Play"}
                      className="wt-press relative grid h-8 w-8 place-items-center rounded-full text-white transition-opacity duration-200 hover:opacity-70"
                    >
                      {music.playing ? <IconPause size={16} /> : <IconPlay size={16} />}
                    </button>
                  </span>
                  <button
                    type="button"
                    onClick={onMusicNext}
                    aria-label="Next track"
                    className="wt-press text-white/90 transition-opacity duration-200 hover:opacity-70"
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
                        ? "wt-press text-white transition-opacity duration-200 hover:opacity-70"
                        : "wt-press text-[#5f5f63] transition-colors duration-200 hover:text-[#8a8a8e]"
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
                        ? "wt-press text-white transition-opacity duration-200 hover:opacity-70"
                        : "wt-press text-[#5f5f63] transition-colors duration-200 hover:text-[#8a8a8e]"
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
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="my-3 h-px bg-[#2e2e2e]" />
                    {LOFI_TRACKS.map((t, i) => (
                      <motion.li
                        key={t.title}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.23, 1, 0.32, 1],
                          delay: i * 0.04,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onMusicSelect(i)}
                          className={`wt-press flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors duration-200 hover:bg-[#2a2a2a] ${
                            i === music.trackIndex ? "text-white" : "text-[#8a8a8e]"
                          }`}
                        >
                          <span className="truncate text-[11px]">{t.title}</span>
                          {i === music.trackIndex && music.playing ? (
                            <span className="ml-auto flex h-2.5 items-end gap-[2px]">
                              <span className="wt-eq w-[2px] origin-bottom bg-white/80 [animation:wt-eq_900ms_ease-in-out_infinite]" style={{ height: "60%" }} />
                              <span className="wt-eq w-[2px] origin-bottom bg-white/80 [animation:wt-eq_900ms_ease-in-out_infinite_120ms]" style={{ height: "100%" }} />
                              <span className="wt-eq w-[2px] origin-bottom bg-white/80 [animation:wt-eq_900ms_ease-in-out_infinite_240ms]" style={{ height: "45%" }} />
                            </span>
                          ) : null}
                        </button>
                      </motion.li>
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
                    className={`h-7 w-[38px] rounded-lg transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      active ? "scale-105" : "hover:scale-[1.04] active:scale-[0.97]"
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

            {/* 24-hour clock */}
            <button
              type="button"
              role="switch"
              aria-checked={hour24}
              onClick={() => onHour24Change(!hour24)}
              className="wt-press mt-1 flex w-full items-center gap-2.5 rounded-xl bg-[#222222] px-3.5 py-2.5 text-left transition-colors duration-200 hover:bg-[#262626]"
            >
              <IconClock24 size={15} className="shrink-0 text-[#9a9a9a]" />
              <span className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                24-Hour Clock
              </span>
              <span
                className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-200 ${
                  hour24 ? "bg-[#1d7dfa]" : "bg-[#333338]"
                }`}
              >
                <span
                  className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    hour24 ? "translate-x-[16px]" : "translate-x-[2px]"
                  }`}
                />
              </span>
            </button>

            {/* board cities */}
            <BoardLayout {...boardLayout} />

            {/* sound system */}
            <section className="rounded-xl border border-[#262626]">
              <button
                type="button"
                onClick={() => setSoundOpen((v) => !v)}
                aria-expanded={soundOpen}
                className="wt-press flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
              >
                <IconSpeaker size={15} className="shrink-0 text-[#9a9a9a]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                  Sound System
                </span>
                <AccordionGlyph open={soundOpen} />
              </button>

              <AnimatePresence initial={false}>
                {soundOpen ? (
                  <motion.div
                    key="sound"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
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
                              className={`wt-press relative z-10 flex-1 rounded-md py-1.5 text-[11px] font-medium transition-colors duration-200 ${
                                active ? "text-white" : "text-[#8a8a8e] hover:text-[#c9c9cc]"
                              }`}
                            >
                              {active ? (
                                <motion.span
                                  layoutId="pref-sound-pill"
                                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                                  className="absolute inset-0 -z-10 rounded-md bg-[#141414]"
                                />
                              ) : null}
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
                className="wt-press flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
              >
                <IconDotGrid size={15} className="shrink-0 text-[#9a9a9a]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                  Discover more by CO.
                </span>
                <AccordionGlyph open={discoverOpen} />
              </button>

              <AnimatePresence initial={false}>
                {discoverOpen ? (
                  <motion.div
                    key="discover"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5">
                      <p className="text-[11px] leading-snug text-[#8a8a8e]">
                        Off-Time — Gallery Companion. Recall memories, clean
                        photos.
                      </p>
                      <button
                        type="button"
                        className="wt-press mt-2.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#111113]"
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
                className="wt-press flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
              >
                <IconLifebuoy size={15} className="shrink-0 text-[#9a9a9a]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                  Support
                </span>
                <AccordionGlyph open={supportOpen} />
              </button>

              <AnimatePresence initial={false}>
                {supportOpen ? (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
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
