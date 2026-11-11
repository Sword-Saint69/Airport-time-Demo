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
import { LoFiEngine, type LoFiState } from "@/lib/lofi";
import { MAP_CITIES } from "@/lib/mapCities";
import { formatLocalTime12, isDaytime } from "@/lib/time";
import { useNow } from "@/lib/useNow";

const DEFAULT_LOCATION_ID = "new-york";

const INITIAL_MUSIC: LoFiState = {
  playing: false,
  trackIndex: 0,
  shuffle: false,
  volume: 0.6,
};

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
  const [volume, setVolume] = useState(40);
  const [musicVolume, setMusicVolume] = useState(60);
  const [music, setMusic] = useState<LoFiState>(INITIAL_MUSIC);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [cities, setCities] = useState<City[]>(() =>
    DEFAULT_CITIES.map((id) => getCity(id)).filter((c): c is City => Boolean(c)),
  );
  const [location, setLocation] = useState<City>(() => {
    const city = getCity(DEFAULT_LOCATION_ID);
    return city ?? getCity(DEFAULT_CITIES[1]) ?? getCity(DEFAULT_CITIES[0])!;
  });
  /** The city picked on the board; the other rows dim while it is set. */
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);
  const lofi = useRef<LoFiEngine | null>(null);

  /* --- lo-fi player ----------------------------------------------------- */

  useEffect(() => {
    const engine = new LoFiEngine();
    lofi.current = engine;
    const unsubscribe = engine.subscribe(setMusic);
    return () => {
      unsubscribe();
      engine.dispose();
      lofi.current = null;
    };
  }, []);

  const handleMusicVolume = useCallback((value: number) => {
    setMusicVolume(value);
    lofi.current?.setVolume(value / 100);
  }, []);

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
        if (ctx.state === "suspended") {
          const resumed = ctx.resume();
          if (resumed && typeof resumed.catch === "function") {
            void resumed.catch(() => {});
          }
        }

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

  const theme = color === "charcoal" ? "light" : "dark";
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
    setSelectedId(city.id);
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

  /* --- world map ------------------------------------------------------- */

  const mapMarkers = useMemo<MapMarker[]>(
    () =>
      MAP_CITIES.map((hub) => ({
        id: hub.id,
        name: hub.name,
        lat: hub.lat,
        lon: hub.lon,
        time: formatLocalTime12(hub.timeZone, now),
        day: isDaytime(hub.timeZone, now),
      })),
    [now],
  );

  const handleMapPick = useCallback(
    (id: string) => {
      const hub = MAP_CITIES.find((c) => c.id === id);
      if (!hub) return;

      const city = getCity(hub.id) ?? {
        id: hub.id,
        name: hub.name,
        country: "World",
        timeZone: hub.timeZone,
        lat: hub.lat,
        lon: hub.lon,
      };

      // Picking a hub on the map selects it and brings it onto the board.
      handlePickCity(city);
    },
    [handlePickCity],
  );

  /* --- expanded mode --------------------------------------------------- */

  /**
   * The current value of `expanded`, kept in a ref so the fullscreen side
   * effect can run inside a click handler without living in a state
   * updater — React StrictMode invokes updaters twice, which would request
   * fullscreen twice and make the first request fail.
   */
  const expandedRef = useRef(false);

  /** Call a platform API that returns a promise without ever letting it reject. */
  const safely = useCallback((result: unknown) => {
    if (result && typeof (result as Promise<void>).catch === "function") {
      void (result as Promise<void>).catch(() => {});
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    const next = !expandedRef.current;
    expandedRef.current = next;
    setExpanded(next);

    if (typeof document === "undefined") return;

    const el = document.documentElement;

    if (next) {
      if (el.requestFullscreen) safely(el.requestFullscreen());
    } else if (document.fullscreenElement && document.exitFullscreen) {
      safely(document.exitFullscreen());
    }
  }, [safely]);

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
            markers={mapMarkers}
            activeId={location.id}
            onMarkerClick={handleMapPick}
            className="w-full md:w-[min(100%,62vw)]"
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
            activeId={selectedId}
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
            activeId={selectedId}
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
    handleMapPick,
    handlePickCity,
    litColor,
    location.id,
    mapMarkers,
    now,
    selectedId,
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
        preferencesOpen={preferencesOpen}
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
        musicVolume={musicVolume}
        onMusicVolumeChange={handleMusicVolume}
        music={music}
        onMusicToggle={() => lofi.current?.toggle()}
        onMusicNext={() => lofi.current?.next()}
        onMusicPrevious={() => lofi.current?.previous()}
        onMusicShuffle={() => lofi.current?.toggleShuffle()}
        onMusicSelect={(index) => lofi.current?.selectTrack(index)}
        onClose={() => setPreferencesOpen(false)}
      />
    </div>
  );
}
