# World Time — LED Matrix Studio

A pixel-faithful recreation of the Apple Watch **World Time** face, rebuilt for the
web as a full-screen LED departure board with a dot-matrix world map and a
`SYSTEM PREFERENCES` drawer.

![board](docs/preview.png)

Everything you see was reverse-engineered from a 1728×1080 60 fps reference
recording: the 5×7 dot-matrix font, the exact cell rhythm, the unlit "off" dot
field, the chrome geometry and the palette were all sampled pixel-by-pixel off
the source frames rather than eyeballed.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript strict)
- **Tailwind CSS v4**
- **framer-motion** for the segmented control, accordions and view transitions
- **Web Audio API** for the tick/confirm tones and the generative lo-fi player
- `Intl.DateTimeFormat` + IANA time zones for every clock (no hand-rolled maths)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## What's in it

| Face | What it does |
| --- | --- |
| **Watch** | Oversized, barely-there numerals with high-contrast hands sweeping over them, plus a live mini preview. |
| **Focus** | A dot-matrix countdown with a progress ring, presets and start/pause/reset. |
| **World Time** | The LED departure board: five cities, live clocks, a scrolling marquee for long names, a searchable city list and a dot-matrix world map. |

Picking a city on the board (or on the map, or from the search) **highlights that
row and dims the rest**, so the selected departure reads instantly.

### The board

`lib/dotFont.ts` holds a 5×7 LED font. Each glyph is 7 rows of 5 cells; `#` is a
lit dot and `.` an unlit one. Glyphs live in a 5-column box and boxes are laid
out on a 6-column rhythm (5 columns + 1 column of gap) — that "five dots then a
breath" texture is what makes the board read as a real LED matrix.

The board is drawn as one SVG:

- a single `<pattern>` of 5×7 unlit dots, tiled into two fields — the clock
  block on the left and the city block on the right — with a blank gutter
  between them, exactly like the reference;
- lit dots drawn per glyph on top, landing on precisely the same lattice.

Long city names scroll seamlessly by rendering two copies of the name inside a
`clipPath` that confines them to the city field, and translating the group by
exactly one name-pitch — in SVG user units, so it stays resolution independent.

### The map

The `Clock / Map` toggle swaps the board for a dot-matrix world map:

- a **150 × 75** land bitmap rasterised from Natural Earth 50m coastlines
  (`lib/worldmap.ts`), drawn as tiny circular dots on a `#141414` canvas;
- isolated ocean specks are filtered out, so the Pacific stays empty;
- every one of the **twenty global hubs** carries a translucent pill badge
  (`rgba(38,38,38,0.85)` + a 6px backdrop blur) pinned over its city;
- the selected city's badge expands to show a sun or moon and its live local
  time, e.g. `🌙 Singapore · 3:16 AM`;
- badges that would collide are nudged apart automatically.

### The drawer

`SYSTEM PREFERENCES` slides in as a fixed 276px left drawer (rounded 16px,
`#181818` on a `#262626` hairline) and hides the face switcher and the
`Clock / Map` pills while it is open. It contains:

- the **Clock Face** card (Digital ⇄ FIDS);
- the **lo-fi player** — a real generative Web Audio engine with a chord pad,
  a vinyl-noise bed, shuffle, a queue and its own volume;
- the five **theme swatches** (Pastel Lime, Warm Yellow, White, Dark Charcoal,
  Ice Blue) which re-tint the board and the canvas;
- the **SOUND SYSTEM** accordion with a `Mute / System / Watch` switch and two
  pill sliders for system and music volume;
- **DISCOVER MORE BY CO.** and **SUPPORT** accordions;
- the pinned brand footer.

## Rendering the live clock

The page is server-rendered per request. The server hands the exact instant it
rendered to the client, and `useSyncExternalStore` uses that value for both the
server markup and the first client render, so hydration never mismatches — and
the very first paint already shows the correct time instead of a placeholder.

## Layout

```
app/
  globals.css        design tokens, theme palettes, animations
  layout.tsx         fonts + metadata
  page.tsx
components/
  Studio.tsx         state, theme, sound, layout
  WorldTimeBoard.tsx the LED board + the digital rendering
  WorldMap.tsx       the dot-matrix world map and its badges
  DotMatrix.tsx      dot text + dot field primitives
  AnalogWatch.tsx    the watch face
  FocusView.tsx      the focus timer
  PreferencesPanel.tsx the SYSTEM PREFERENCES drawer
  TopBar.tsx / BottomBar.tsx / Segmented.tsx / GlassButton.tsx / Icons.tsx
lib/
  dotFont.ts         the 5x7 font
  cities.ts          227 cities with IANA zones and coordinates
  mapCities.ts       the twenty hubs shown on the map
  time.ts            timezone maths, GMT labels, formatting
  worldmap.ts        the 150x75 land bitmap
  lofi.ts            the generative lo-fi engine
  useNow.ts          a clock that re-aligns to the wall clock every second
```

## Accessibility

Every control is a real focusable element with an accessible name, the board
rows respond to Enter/Space, the map badges are buttons, the drawer uses radio
groups for its single-choice controls, and `prefers-reduced-motion` disables the
marquee and the entrance animations.

---

## Future improvements and features

A roadmap of what would come next, roughly in the order it would be worth
building.

**Board and typography**

1. **A second font.** The 5×7 dot font is the reference's — a 5×9 "tall" face
   would let the board switch between an airline-departure look and a
   high-contrast one, the way real FIDS boards do.
2. **Per-row status colours.** Blue for "boarding", amber for "delayed",
   red for "cancelled" — with a legend in the drawer.
3. **Flap / split-flap animation.** Rows could flip character by character when
   the minute changes, the way a mechanical board does.
4. **Configurable row count.** Let the board show 3, 5 or 8 cities depending on
   the viewport instead of always filling five rows.
5. **A live seconds column**, blinking on the beat, for people who want the
   precision.

**Map**

6. **Sun-path overlay.** A terminator line across the map so you can see where
   it is night right now, instead of only inferring it from each badge.
7. **Zoom and pan.** Pinch or scroll to zoom into a region; the badges would
   declutter as you zoom in.
8. **Timezone bands.** Fill the map with subtle colour bands for each UTC
   offset, so the whole world's rhythm reads at a glance.
9. **A bigger land dataset.** Swap Natural Earth 50m for 10m at higher zoom
   levels, and render the coastline as a real polyline rather than dots.

**Preferences drawer**

10. **A real clock-face picker.** Right now the Clock Face card toggles
    Digital/FIDS; it could offer a gallery of faces instead.
11. **Per-city custom layouts.** Let a city be pinned to a board slot, given a
    nickname, or reordered.
12. **Persist the drawer state** — theme, sound mode, volumes and the lo-fi
    track — to `localStorage` so the app comes back the way you left it.
13. **More lo-fi tracks**, plus an equaliser and a sleep timer.
14. **An appearance section** for the chrome itself — the drawer's colours,
    the corner radius, the density of the layout.

**Product**

15. **A watch face for the real thing.** The same board, the same font, running
    as a watchOS complication or a standalone watch app.
16. **Alerts.** A city can be starred and the app can notify you when it is
    midnight there, or when a saved flight lands.
17. **Fullscreen "signage" mode.** A kiosk-friendly layout with no chrome at
    all, driven by a URL parameter, for a lobby screen.
18. **Offline support.** A service worker so the board keeps ticking with no
    network.
19. **More cities.** The catalogue has 227; the world's capitals and time-zone
    capitals are still missing.
20. **Shareable board snapshots.** Render the current board to a PNG so it can
    be posted.
