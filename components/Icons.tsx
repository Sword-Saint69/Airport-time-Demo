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

export function IconSun(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.5 6.5 5 5M19 19l-1.5-1.5M17.5 6.5 19 5M5 19l1.5-1.5" />
    </svg>
  );
}


export function IconCoffee(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.2 9h12.4v5.2A5.2 5.2 0 0 1 11.4 19.4H9.4a5.2 5.2 0 0 1-5.2-5.2V9Z" />
      <path d="M16.6 10.4h1.2a2.7 2.7 0 0 1 0 5.4h-1.4" />
      <path d="M8.4 5.6c.9.9.9 1.9 0 2.8M12.4 5.6c.9.9.9 1.9 0 2.8" />
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

