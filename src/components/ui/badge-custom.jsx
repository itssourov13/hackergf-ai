import { cn } from "@/lib/utils";
import * as React from "react";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-red-950/60 text-red-300 border-red-900/50",
    secondary: "bg-zinc-900 text-zinc-300 border-zinc-800",
    outline: "border-zinc-700 text-zinc-400",
    success: "bg-green-950/60 text-green-300 border-green-900/50",
    warning: "bg-yellow-950/60 text-yellow-300 border-yellow-900/50",
  };
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };