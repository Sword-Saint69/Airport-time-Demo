"use client";

import { useEffect } from "react";
import { DotText } from "@/components/DotMatrix";

/**
 * The route-level error boundary.
 *
 * A failure in the board should not leave a blank white page — it should
 * look like the board itself went out of order. The fallback is rendered in
 * the same dot-matrix language as the rest of the app, and it offers a
 * retry that re-renders the segment rather than a dead-end reload.
 */
export default function ErrorFallback({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    // Log it, but keep the message out of the UI: in production the server
    // deliberately hides the original message from the client.
    console.error("[world-time] render failed:", error);
  }, [error]);

  const message =
    error instanceof Error && error.message
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error";

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-7 bg-[var(--bg)] px-6 text-[var(--fg)]">
      <div className="flex flex-col items-center gap-3">
        {/* The dot-matrix text is decorative, so it is hidden from
            assistive technology; the heading below carries the meaning. */}
        <DotText
          text="ERROR"
          lit="var(--dot-lit)"
          dim="var(--dot-dim)"
          unit={9}
          className="max-w-full"
          style={{ width: "min(78vw, 460px)", height: "auto" }}
        />
        <DotText
          text="TRY AGAIN"
          lit="var(--dot-lit)"
          dim="var(--dot-dim)"
          unit={4}
          style={{ width: "min(52vw, 300px)", height: "auto", opacity: 0.75 }}
        />
      </div>

      <h1 className="sr-only">The board lost sync</h1>

      <p className="max-w-md text-center text-[13px] leading-relaxed text-[var(--fg-2)]">
        The board lost sync. {message}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="wt-press rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#111113]"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="wt-press rounded-full border border-[var(--hairline)] px-5 py-2.5 text-[13px] font-medium text-[var(--fg-2)]"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
