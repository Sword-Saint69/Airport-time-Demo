import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: "false" as const,
    ...rest,
  };
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 0, ...props })} fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function IconExpand(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 4.5h5v5M19.5 4.5L11 13M9.5 19.5h-5v-5M4.5 19.5L13 11" />
    </svg>
  );
}

export function IconCollapse(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19.5 9.5h-5v-5M14.5 9.5l5-5M4.5 14.5h5v5M9.5 14.5l-5 5" />
    </svg>
  );
}

export function IconPalette(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.6a8.4 8.4 0 1 0 0 16.8c1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8h1.5a4.2 4.2 0 0 0 4.2-4.2c0-3.6-3.7-6.6-8.4-6.6Z" />
      <circle cx="7.8" cy="11.4" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="10.3" cy="7.6" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8.1" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="7.2" cy="15.2" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.8" cy="10.8" r="6.1" />
      <path d="M15.4 15.4L20 20" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8.2 5.4 18 12l-9.8 6.6V5.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPause(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7.6" y="5.4" width="3.4" height="13.2" rx="1.4" fill="currentColor" stroke="none" />
      <rect x="13" y="5.4" width="3.4" height="13.2" rx="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconReset(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19.2 12a7.2 7.2 0 1 1-2.3-5.3" />
      <path d="M19.4 4.4v4.2h-4.2" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * Sidebar glyphs
 * ---------------------------------------------------------------------- */

/** A single solid square dot — the mark beside "SYSTEM PREFERENCES". */
export function IconDotSquare(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 0, ...props })} fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
    </svg>
  );
}

/** A 2x2 grid of dots — the "Discover more" mark. */
export function IconDotGrid(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 0, ...props })} fill="currentColor">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.5 12h13" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function IconSpeaker(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5h3l4-3.2v11.4l-4-3.2H4Z" />
      <path d="M14.6 9.2a3.6 3.6 0 0 1 0 5.6" />
      <path d="M17.1 6.7a7 7 0 0 1 0 10.6" />
    </svg>
  );
}

/** A lifebuoy — the "Support" mark. */
export function IconLifebuoy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="m6.1 6.1 3.6 3.6M14.3 14.3l3.6 3.6M17.9 6.1l-3.6 3.6M9.7 14.3l-3.6 3.6" />
    </svg>
  );
}

export function IconShuffle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 6.5h3.2c1.6 0 2.6.9 3.6 2.4l3 4.6c1 1.5 2 2.4 3.6 2.4h3.6" />
      <path d="M3.5 17.5h3.2c1.6 0 2.6-.9 3.6-2.4l.7-1.1" />
      <path d="m13.2 7.6 1.3-1.9c.9-1.3 1.9-2.1 3.3-2.1h2.7" />
      <path d="M18.4 3.6 21 6.2l-2.6 2.6M18.4 15.2l2.6 2.6-2.6 2.6" />
    </svg>
  );
}

/** A stacked "queue" mark. */
export function IconQueue(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.6" y="4.4" width="12" height="9" rx="2" />
      <path d="M8.6 17.2h11.8M8.6 20.2h8.2" />
    </svg>
  );
}

export function IconPrev(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 0, ...props })} fill="currentColor">
      <rect x="5" y="5.5" width="2.4" height="13" rx="1.2" />
      <path d="M19 6.6v10.8L9.6 12 19 6.6Z" />
    </svg>
  );
}

export function IconNext(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 0, ...props })} fill="currentColor">
      <rect x="16.6" y="5.5" width="2.4" height="13" rx="1.2" />
      <path d="M5 6.6v10.8L14.4 12 5 6.6Z" />
    </svg>
  );
}

/** A clock face for the "Clock Face" badge. */
export function IconClockFace(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.2V12l3.4 2.2" />
    </svg>
  );
}

/** The glossy blue/white brand sphere. */
export function IconSphere(props: IconProps) {
  return (
    <svg
      {...base({ strokeWidth: 0, ...props })}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="wt-sphere" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#bcd9ff" />
          <stop offset="66%" stopColor="#3d8bff" />
          <stop offset="100%" stopColor="#0b3f9c" />
        </radialGradient>
        <linearGradient id="wt-sphere-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9.2" fill="url(#wt-sphere)" />
      <ellipse cx="9" cy="7.4" rx="4.4" ry="2.7" fill="url(#wt-sphere-sheen)" />
    </svg>
  );
}

