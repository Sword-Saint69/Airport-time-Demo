import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * The OpenNext configuration for Cloudflare Workers.
 *
 * The defaults are used deliberately: the app renders per request (the page
 * is `force-dynamic`, because it is a live clock) so there is nothing to
 * cache, and no incremental cache or tag cache is needed.
 */
export default defineCloudflareConfig({});
