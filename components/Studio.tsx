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
import { ShortcutSheet } from "@/components/ShortcutSheet";
import { TopBar, type StudioTab } from "@/components/TopBar";
import { DigitalBoard, WorldTimeBoard } from "@/components/WorldTimeBoard";
import WorldMap, { type MapMarker } from "@/components/WorldMap";
import { DEFAULT_CITIES, getCity, type City } from "@/lib/cities";
import { MusicPlayer, type MusicState } from "@/lib/music";
import { MAP_CITIES } from "@/lib/mapCities";
import {
  usePersistentState,
  type Preferences,
} from "@/lib/preferences";
import { formatLocalTime, isDaytime } from "@/lib/time";
import { useCities } from "@/lib/useCities";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { useNow } from "@/lib/useNow";

const DEFAULT_LOCATION_ID = "new-york";

const INITIAL_MUSIC: MusicState = {
  playing: false,
  trackIndex: 0,
  shuffle: false,
  volume: 0.6,
  position: 0,
  duration: 0,
};

export interface StudioProps {
  /** The instant the server rendered the page (ms since the epoch). */
  initialNow: number;
}

export function Studio({ initialNow }: StudioProps) {
  const now = useNow(initialNow);

  const { prefs, hydrated, setPref, patch } = usePersistentState();

  const [tab, setTab] = useState<StudioTab>("world");
  const [bottomView, setBottomView] = useState<"clock" | "map">("clock");
  const [music, setMusic] = useState<MusicState>(INITIAL_MUSIC);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);
  const player = useRef<MusicPlayer | null>(null);

  /* --- persisted state ------------------------------------------------- */

  const color = prefs.color;
  const boardMode = prefs.boardMode;
  const sound = prefs.sound;
  const volume = prefs.volume;
  const musicVolume = prefs.musicVolume;
  const hour24 = prefs.hour24;

  const [location, setLocation] = useState<City>(() => {
    const city = getCity(DEFAULT_LOCATION_ID);
    return city ?? getCity(DEFAULT_CITIES[1]) ?? getCity(DEFAULT_CITIES[0])!;
  });

  /**
   * The stored preferences are applied once the first render has happened.
   * Applying them during the render itself would desynchronise the server
   * markup from the client tree.
   */
  const restored = useRef(false);
  useEffect(() => {
    if (!hydrated || restored.current) return;
    restored.current = true;
    const city = getCity(prefs.locationCityId);
    if (city) setLocation(city);
  }, [hydrated, prefs.locationCityId]);

  /* --- lo-fi player ----------------------------------------------------- */

  useEffect(() => {
    const engine = new MusicPlayer();
    player.current = engine;
    const unsubscribe = engine.subscribe(setMusic);
    return () => {
      unsubscribe();
      engine.dispose();
      player.current = null;
    };
  }, []);

  const handleMusicVolume = useCallback(
    (value: number) => {
      setPref("musicVolume", value);
      player.current?.setVolume(value / 100);
    },
    [setPref],
  );

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

  /* --- board cities --------------------------------------------------- */

  const cityState = useCities(
    prefs.boardCityIds,
    prefs.favouriteCityIds,
    useCallback((ids: string[]) => setPref("boardCityIds", ids), [setPref]),
    useCallback(
      (ids: string[]) => setPref("favouriteCityIds", ids),
      [setPref],
    ),
  );

  const board = cityState.board;

  const handlePickCity = useCallback(
    (city: City) => {
      setLocation(city);
      setSelectedId(city.id);
      setPref("locationCityId", city.id);
      // A newly picked city takes the last slot, exactly like the reference.
      cityState.putOnBoard(city.id);
    },
    [cityState, setPref],
  );

  /* --- world map ------------------------------------------------------- */

  const mapMarkers = useMemo<MapMarker[]>(
    () =>
      MAP_CITIES.map((hub) => ({
        id: hub.id,
        name: hub.name,
        lat: hub.lat,
        lon: hub.lon,
        time: formatLocalTime(hub.timeZone, now, hour24),
        day: isDaytime(hub.timeZone, now),
      })),
    [now, hour24],
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

  /**
   * Move the selection to a board row. Rows are addressed by index, and
   * picking one both selects it and sends it to the top of the board.
   */
  const pickRow = useCallback(
    (index: number) => {
      const city = board[index];
      if (!city) return;
      handlePickCity(city);
      setBottomView("clock");
      setTab("world");
    },
    [board, handlePickCity],
  );

  const stepRow = useCallback(
    (delta: number) => {
      if (board.length === 0) return;
      const current = board.findIndex((c) => c.id === location.id);
      const next =
        current === -1
          ? 0
          : (current + delta + board.length) % board.length;
      const city = board[next];
      if (city) handlePickCity(city);
    },
    [board, location.id, handlePickCity],
  );

  const shortcutHandlers = useMemo(
    () => ({
      onPickRow: pickRow,
      onStep: stepRow,
      onToggleMap: () => {
        setBottomView((v) => (v === "map" ? "clock" : "map"));
        setTab("world");
      },
      onFocusView: () => setTab("focus"),
      onWatchView: () => setTab("watch"),
      onWorldView: () => setTab("world"),
      onSearch: () => {
        setTab("world");
        setBottomView("clock");
        // The search field lives in the bottom bar; ask it to open.
        window.dispatchEvent(new CustomEvent("world-time:search"));
      },
      onToggleMusic: () => player.current?.toggle(),
      onShowHelp: () => setShortcutsOpen((v) => !v),
      onEscape: () => {
        if (shortcutsOpen) setShortcutsOpen(false);
        else if (preferencesOpen) setPreferencesOpen(false);
        else setSelectedId(null);
      },
    }),
    [pickRow, stepRow, shortcutsOpen, preferencesOpen],
  );

  useKeyboardShortcuts(shortcutHandlers);

  const boardView = useMemo(() => {
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
            cities={board}
            now={now}
            hour24={hour24}
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
            cities={board}
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
    board,
    expanded,
    handleMapPick,
    handlePickCity,
    hour24,
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
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
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
              boardView
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
        onBoardModeChange={(mode) => setPref("boardMode", mode)}
        color={color}
        onColorChange={(next) => setPref("color", next)}
        sound={sound}
        onSoundChange={(next) => setPref("sound", next)}
        volume={volume}
        onVolumeChange={(next) => setPref("volume", next)}
        musicVolume={musicVolume}
        onMusicVolumeChange={handleMusicVolume}
        music={music}
        onMusicToggle={() => player.current?.toggle()}
        onMusicNext={() => player.current?.next()}
        onMusicPrevious={() => player.current?.previous()}
        onMusicShuffle={() => player.current?.toggleShuffle()}
        onMusicSelect={(index) => player.current?.selectTrack(index)}
        onMusicSeek={(seconds) => player.current?.seek(seconds)}
        hour24={hour24}
        onHour24Change={(next) => setPref("hour24", next)}
        boardLayout={{
          board: cityState.board,
          favourites: cityState.favourites,
          isFavourite: cityState.isFavourite,
          onToggleFavourite: cityState.toggleFavourite,
          onAddCity: cityState.putOnBoard,
          onMoveRow: cityState.moveBoardRow,
          onRemoveRow: cityState.removeBoardRow,
          onSearch: cityState.search,
        }}
        onClose={() => setPreferencesOpen(false)}
      />

      <ShortcutSheet
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}
