"use client";

import type { ReactNode } from "react";
import { GlassButton } from "@/components/GlassButton";
import { IconClose, IconCollapse, IconExpand, IconPalette } from "@/components/Icons";
import { Segmented } from "@/components/Segmented";

export type StudioTab = "watch" | "focus" | "world";

export interface TopBarProps {
  tab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  onTogglePreferences: () => void;
  preferencesOpen: boolean;
  onClose: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  /** Optional preview rendered under the palette button. */
  accessory?: ReactNode;
}

export function TopBar({
  tab,
  onTabChange,
  onTogglePreferences,
  preferencesOpen,
  onClose,
  expanded,
  onToggleExpanded,
  accessory,
}: TopBarProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 px-[clamp(12px,1.6vw,28px)] pt-[clamp(12px,1.6vw,28px)]">
      {preferencesOpen ? (
        // The drawer covers the top-left corner, so the face switcher and the
        // palette button step aside while it is open.
        <div className="pointer-events-auto" />
      ) : (
        <div className="pointer-events-auto flex flex-col items-start gap-2">
          <div className="flex items-center gap-2.5">
            <Segmented
              layoutId="top-tabs"
              label="Face"
              value={tab}
              onChange={onTabChange}
              options={[
                { value: "watch", label: "Watch" },
                { value: "focus", label: "Focus" },
                { value: "world", label: "World Time" },
              ]}
            />
            <GlassButton
              label="System preferences"
              active={preferencesOpen}
              onClick={onTogglePreferences}
            >
              <IconPalette size={17} />
            </GlassButton>
          </div>
          {accessory ? <div className="self-end">{accessory}</div> : null}
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-2.5">
        <GlassButton label="Close" onClick={onClose}>
          <IconClose size={16} />
        </GlassButton>
        <GlassButton
          label={expanded ? "Collapse" : "Expand"}
          onClick={onToggleExpanded}
        >
          {expanded ? <IconCollapse size={16} /> : <IconExpand size={16} />}
        </GlassButton>
      </div>
    </div>
  );
}
