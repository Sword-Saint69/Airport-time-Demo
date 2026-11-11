/**
 * Source for a tiny inline script that is rendered into the document head.
 *
 * It has to run *before* any client bundle, which is why it is inline
 * markup rather than a client component: the Next.js development overlay
 * registers its own `unhandledrejection` listener when its module is
 * evaluated, and that happens after the document has been parsed.
 *
 * Why this exists
 * ---------------
 * React 19 gives every resource it manages (a `<link>` or `<script>` it
 * preloads) a promise that is rejected with the DOM **error event** when
 * the resource fails to load. Nothing awaits that promise, so the rejection
 * is unhandled and the Next.js dev overlay reports it as:
 *
 *     Runtime Error
 *     [object Event]
 *
 * The message carries no stack and no actionable information — it is just
 * `String(event)`. The same shape comes from a platform API (Fullscreen is
 * the usual one) refusing a request.
 *
 * The script therefore:
 *
 *  - logs the rejection in full (type, own properties, creation stack) so
 *    nothing is ever silently swallowed, and
 *  - keeps these platform rejections out of the overlay, while leaving
 *    genuine application errors completely untouched.
 */

/** The inline script, as a string of JavaScript. */
export const CLIENT_GUARD_SCRIPT = `
(function () {
  if (window.__worldTimeGuard) return;
  window.__worldTimeGuard = true;

  function isDomEvent(value) {
    if (!value || typeof value !== "object") return false;
    var tag = Object.prototype.toString.call(value);
    return tag === "[object Event]" || /\\[object .*Event\\]$/.test(tag);
  }

  function describe(value) {
    if (value === null || value === undefined) return String(value);
    if (value instanceof Error) return value.name + ": " + value.message;
    var tag = Object.prototype.toString.call(value);
    var detail = "";
    try {
      detail = JSON.stringify(value, Object.getOwnPropertyNames(value));
    } catch (e) {
      detail = String(value);
    }
    return tag + " " + detail;
  }

  window.addEventListener(
    "unhandledrejection",
    function (event) {
      var reason = event.reason;
      // A real error: leave it for React and the overlay to report.
      if (!isDomEvent(reason)) return;

      console.warn(
        "[world-time] A platform API rejected with an event: " +
          describe(reason)
      );
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true
  );
})();
`;
