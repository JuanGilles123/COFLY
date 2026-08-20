import React from "react";
import { cn } from "../../lib/utils";

export const Ripple = React.memo(({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]",
        className
      )}
    >
      {Array.from({ length: numCircles }).map((_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full border bg-foreground/5 shadow-xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: Math.max(opacity, 0.03),
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: "1.5px",
              borderColor: `rgba(120, 117, 130, ${borderOpacity / 100})`,
              "--i": i,
            }}
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
