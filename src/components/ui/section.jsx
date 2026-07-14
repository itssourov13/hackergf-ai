import { cn } from "@/lib/utils";
import * as React from "react";

const Section = React.forwardRef(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("py-16 sm:py-20 lg:py-24", className)}
    {...props}
  />
));
Section.displayName = "Section";

export { Section };