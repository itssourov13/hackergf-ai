import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Loading fallback displayed by <Suspense> while lazy-loaded route chunks are fetched.
 * Full-screen overlay with an accessible loading indicator.
 */
export default function RouteLoader() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-zinc-950"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
        <span className="text-sm text-zinc-500">Loading…</span>
      </div>
    </div>
  );
}