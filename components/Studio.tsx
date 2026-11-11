"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnalogWatch } from "@/components/AnalogWatch";
import { BottomBar } from "@/components/BottomBar";
import { FocusView } from "@/components/FocusView";
import {
  BOARD_COLORS,
  PreferencesPanel,
  type BoardColor,
  type BoardMode,
  type SoundMode,
} from "@/components/PreferencesPanel";
import { TopBar, type StudioTab } from "@/components/TopBar";
import { DigitalBoard, WorldTimeBoard } from "@/components/WorldTimeBoard";
import WorldMap, { type MapMarker } from "@/components/WorldMap";
import { DEFAULT_CITIES, getCity, type City } from "@/lib/cities";
import { useNow } from "@/lib/useNow";

const DEFAULT_LOCATION_ID = "new-york";

export interface StudioProps {
  /** The instant the server rendered the page (ms since the epoch). */
  initialNow: number;
}

export function Studio({ initialNow }: StudioProps) {
  const now = useNow(initialNow);

  const [tab, setTab] = useState<StudioTab>("world");
  const [bottomView, setBottomView] = useState<"clock" | "map">("clock");
  const [boardMode, setBoardMode] = useState<BoardMode>("fids");
  const [color, setColor] = useState<BoardColor>("white");
  const [sound, setSound] = useState<SoundMode>("watch");
  const [volume, setVolume] = useState(100);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [cities, setCities] = useState<City[]>(() =>
    DEFAULT_CITIES.map((id) => getCity(id)).filter((c): c is City => Boolean(c)),
  );
  const [location, setLocation] = useState<City>(() => {
    const city = getCity(DEFAULT_LOCATION_ID);
    return city ?? getCity(DEFAULT_CITIES[1]) ?? getCity(DEFAULT_CITIES[0])!;
  });

  const audioCtx = useRef<AudioContext | null>(null);

  /* --- sound ---------------------------------------------------------- */

  const playTone = useCallback(
    (kind: "start" | "stop") => {
      if (sound === "mute") return;
      if (typeof window === "undefined") return;
      try {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return;
        if (!audioCtx.current) audioCtx.current = new Ctor();
        const ctx = audioCtx.current;
        if (ctx.state === "suspended") void ctx.resume();

        const gainValue = sound === "system" ? 0.16 : (volume / 100) * 0.16;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(kind === "start" ? 880 : 560, ctx.currentTime);
        if (kind === "stop") {
          osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.16);
        }
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.26);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        /* audio is a nicety, never a failure */
      }
    },
    [sound, volume],
  );

  /* --- theme ---------------------------------------------------------- */

  const theme = color === "black" ? "light" : "dark";
  const palette = useMemo(
    () => BOARD_COLORS.find((c) => c.id === color) ?? BOARD_COLORS[0],
    [color],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.setProperty("--bg", palette.bg);
    root.style.setProperty("--dot-lit", palette.value);
    root.style.setProperty("--dot-dim", palette.dim);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", palette.bg);
  }, [theme, palette]);

  const litColor = palette.value;
  const dimColor = palette.dim;

  /* --- world time board ------------------------------------------------ */

  const handlePickCity = useCallback((city: City) => {
    setLocation(city);
    setCities((prev) => {
      if (prev.some((c) => c.id === city.id)) {
        // Already on the board — leave the running order untouched.
        return prev;
      }
      // A newly picked city takes the last slot, exactly like the reference.
      const next = [...prev];
      next[next.length - 1] = city;
      return next;
    });
  }, []);

  const markers = useMemo<MapMarker[]>(
    () =>
      cities.map((city) => ({
        id: city.id,
        name: city.name,
        lat: city.lat,
        lon: city.lon,
      })),
    [cities],
  );

  /* --- expanded mode --------------------------------------------------- */

  const toggleExpanded = useCallback(() => {
    setExpanded((v) => {
      const next = !v;
      if (typeof document !== "undefined") {
        const el = document.documentElement;
        if (next && el.requestFullscreen) void el.requestFullscreen().catch(() => {});
        else if (!next && document.fullscreenElement && document.exitFullscreen) {
          void document.exitFullscreen().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setPreferencesOpen(false);
    setTab("world");
    setBottomView("clock");
  }, []);

  /* --- keyboard -------------------------------------------------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (preferencesOpen) setPreferencesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preferencesOpen]);

  const board = useMemo(() => {
    if (bottomView === "map") {
      return (
        <div className="flex h-full w-full items-center justify-center px-[clamp(12px,3vw,56px)]">
          <WorldMap
            markers={markers}
            activeId={location.id}
            activeColor={litColor}
            landColor={theme === "light" ? "#c9c9cf" : "#34343a"}
            onMarkerClick={(id) => {
              const city = cities.find((c) => c.id === id);
              if (city) handlePickCity(city);
            }}
            className="h-auto w-full"
          />
        </div>
      );
    }
    if (boardMode === "digital") {
      return (
        <div className="flex h-full w-full items-center justify-center px-[clamp(12px,3vw,56px)]">
          <DigitalBoard
            cities={cities}
            now={now}
            activeId={location.id}
            onSelectCity={handlePickCity}
          />
        </div>
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center px-[clamp(12px,2.4vw,44px)]">
        <motion.div
          animate={{ scale: expanded ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="w-[min(100%,77vw)]"
          style={{ ["--dot-lit" as string]: litColor }}
        >
          <WorldTimeBoard
            cities={cities}
            now={now}
            activeId={location.id}
            onSelectCity={handlePickCity}
          />
        </motion.div>
      </div>
    );
  }, [
    bottomView,
    boardMode,
    cities,
    expanded,
    handlePickCity,
    litColor,
    location.id,
    markers,
    now,
    theme,
  ]);

  return (
    <div
      data-theme={theme}
      className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg)] text-[var(--fg)]"
      style={{
        ["--dot-lit" as string]: litColor,
        ["--dot-dim" as string]: dimColor,
        ["--watch-numeral" as string]: theme === "light" ? "#d2d2d6" : "#1d1d21",
        ["--watch-hand" as string]: theme === "light" ? "#16161a" : "#f4f4f7",
        ["--accent" as string]: litColor,
      }}
    >
      <TopBar
        tab={tab}
        onTabChange={setTab}
        onTogglePreferences={() => setPreferencesOpen((v) => !v)}
        preferencesOpen={preferencesOpen}
        onClose={closeAll}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
        accessory={
          tab === "watch" ? (
            <AnalogWatch now={now} variant="mini" className="h-10 w-10 opacity-70" />
          ) : null
        }
      />

      <main className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="h-full w-full"
          >
            {tab === "watch" ? (
              <div className="relative grid h-full w-full place-items-center">
                <AnalogWatch
                  now={now}
                  className="h-[min(78vh,78vw)] w-[min(78vh,78vw)]"
                />
              </div>
            ) : tab === "focus" ? (
              <FocusView onSound={playTone} />
            ) : (
              board
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomBar
        view={bottomView}
        onViewChange={setBottomView}
        location={location}
        now={now}
        onPickCity={handlePickCity}
        hidden={expanded}
      />

      <PreferencesPanel
        open={preferencesOpen}
        boardMode={boardMode}
        onBoardModeChange={setBoardMode}
        color={color}
        onColorChange={setColor}
        sound={sound}
        onSoundChange={setSound}
        volume={volume}
        onVolumeChange={setVolume}
        onClose={() => setPreferencesOpen(false)}
      />

    </div>
  );
}
