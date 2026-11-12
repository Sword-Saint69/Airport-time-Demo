"use client";

import { useEffect } from "react";

/**
 * Keyboard shortcuts.
 *
 * A world clock is a tool you leave running, so it should be drivable from
 * the keyboard without reaching for the mouse. The bindings are deliberately
 * few and mnemonic:
 *
 *   1-5   pick the city in that board row
 *   ↑ ↓   step through the board
 *   M     toggle the world map
 *   F     focus timer
 *   W     watch face
 *   /     search for a city
 *   Space play / pause the music
 *   ?     show this list
 *   Esc   close whatever is open
 *
 * Shortcuts never fire while the user is typing in a field.
 */

export interface ShortcutHandlers {
  /** Jump to the board row at this index (0-based). */
  onPickRow?: (index: number) => void;
  /** Step to the previous/next board row. */
  onStep?: (delta: number) => void;
  /** Toggle between the board and the map. */
  onToggleMap?: () => void;
  /** Switch to the focus timer. */
  onFocusView?: () => void;
  /** Switch to the analog watch. */
  onWatchView?: () => void;
  /** Switch to the world time board. */
  onWorldView?: () => void;
  /** Focus the city search field. */
  onSearch?: () => void;
  /** Toggle music playback. */
  onToggleMusic?: () => void;
  /** Open the shortcut list. */
  onShowHelp?: () => void;
  /** Close the topmost open thing. */
  onEscape?: () => void;
}

/** True when the event came from a text field, so shortcuts stay out of the way. */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return false;
}

/**
 * True when the focused element consumes the Space key itself.
 *
 * Space activates a focused button, link or checkbox. Hijacking it would
 * break keyboard operation of every control in the app, so the shortcut
 * stands down whenever one of them has focus.
 */
function consumesSpace(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  if (tag === "BUTTON" || tag === "A" || tag === "SUMMARY") return true;

  if (tag === "INPUT") {
    const type = (target as HTMLInputElement).type;
    return type === "checkbox" || type === "radio" || type === "button";
  }

  const role = target.getAttribute("role");
  return role === "button" || role === "checkbox" || role === "radio";
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Never steal a key from a text field, and never hijack a modifier
      // combination the browser or the OS owns.
      if (isTyping(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const { key } = event;

      if (key === "Escape") {
        handlers.onEscape?.();
        return;
      }

      if (key === "?") {
        event.preventDefault();
        handlers.onShowHelp?.();
        return;
      }

      if (key === "/") {
        event.preventDefault();
        handlers.onSearch?.();
        return;
      }

      if (key === " ") {
        // A focused button, link or checkbox owns the Space key.
        if (consumesSpace(event.target)) return;
        event.preventDefault();
        handlers.onToggleMusic?.();
        return;
      }

      if (key === "m" || key === "M") {
        handlers.onToggleMap?.();
        return;
      }

      if (key === "f" || key === "F") {
        handlers.onFocusView?.();
        return;
      }

      if (key === "w" || key === "W") {
        handlers.onWatchView?.();
        return;
      }

      if (key === "t" || key === "T") {
        handlers.onWorldView?.();
        return;
      }

      if (key === "ArrowUp" || key === "ArrowDown") {
        event.preventDefault();
        handlers.onStep?.(key === "ArrowUp" ? -1 : 1);
        return;
      }

      if (key >= "1" && key <= "9") {
        const index = Number(key) - 1;
        handlers.onPickRow?.(index);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
