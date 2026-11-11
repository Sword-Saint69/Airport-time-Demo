import { Studio } from "@/components/Studio";

// The board is a live clock, so the page is rendered per request: the server
// hands the exact instant it rendered to the client, which keeps the markup
// and the first client render identical (no hydration mismatch) while still
// showing the correct time in the very first paint.
export const dynamic = "force-dynamic";

export default function Page() {
  return <Studio initialNow={Date.now()} />;
}
