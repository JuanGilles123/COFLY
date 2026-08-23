import React from "react";
import { cn } from "../../lib/utils";

export function BorderBeam({
  children,
  className,
  beamClassName,
  size = 200,
  duration = 4, // Conic spin duration (4s is perfect)
  borderWidth = 1.5,
  colorFrom = "#EF5F18", // Orange
  colorTo = "#251a65",   // Navy
  delay = 0,
}) {
  const beam = (
    <div
      style={{
        "--duration": `${duration}s`,
        "--border-width": `${borderWidth}px`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `${delay}s`,
      }}
      className={cn("border-beam-conic", children ? beamClassName : className)}
    />
  );

  if (!children) {
    return beam;
  }

  return (
    <div className={cn("relative rounded-[8px]", className)}>
      {children}
      {beam}
    </div>
  );
}
