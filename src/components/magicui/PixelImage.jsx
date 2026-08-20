import React, { useRef, useState, useEffect, useMemo } from "react";
import { useInView } from "framer-motion";
import { cn } from "../../lib/utils";

const DEFAULT_GRIDS = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
};

export function PixelImage({
  src,
  grid = "6x4",
  customGrid,
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  once = false,
  className,
  ...props
}) {
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once });
  const [showColor, setShowColor] = useState(false);

  const MIN_GRID = 1;
  const MAX_GRID = 16;

  // Determine grid dimensions
  const dimensions = useMemo(() => {
    const isValidGrid = (g) => {
      if (!g) return false;
      const { rows, cols } = g;
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      );
    };

    return isValidGrid(customGrid) ? customGrid : (DEFAULT_GRIDS[grid] || DEFAULT_GRIDS["6x4"]);
  }, [grid, customGrid]);

  // Generate grid pieces with custom clip paths and random delays
  const pieces = useMemo(() => {
    const total = dimensions.rows * dimensions.cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / dimensions.cols);
      const col = index % dimensions.cols;

      const clipPath = `polygon(
        ${col * (100 / dimensions.cols)}% ${row * (100 / dimensions.rows)}%,
        ${(col + 1) * (100 / dimensions.cols)}% ${row * (100 / dimensions.rows)}%,
        ${(col + 1) * (100 / dimensions.cols)}% ${(row + 1) * (100 / dimensions.rows)}%,
        ${col * (100 / dimensions.cols)}% ${(row + 1) * (100 / dimensions.rows)}%
      )`;

      // Staggered random delay for the grid cell reveal
      const delay = Math.random() * maxAnimationDelay;
      return {
        clipPath,
        delay,
      };
    });
  }, [dimensions, maxAnimationDelay]);

  // Color reveal timing when entering view
  useEffect(() => {
    if (isInView) {
      const colorTimeout = setTimeout(() => {
        setShowColor(true);
      }, colorRevealDelay);
      return () => clearTimeout(colorTimeout);
    } else if (!once) {
      setShowColor(false);
    }
  }, [isInView, colorRevealDelay, once]);

  return (
    <div
      ref={elementRef}
      className={cn("relative select-none overflow-hidden", className)}
      {...props}
    >
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all ease-out",
            isInView ? "opacity-100" : "opacity-0"
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${piece.delay}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          <img
            src={src}
            alt={`Pixel image piece ${index + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale")
            )}
            style={
              grayscaleAnimation
                ? {
                    filter: showColor ? "grayscale(0)" : "grayscale(1)",
                    transition: `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  }
                : {}
            }
            draggable="false"
          />
        </div>
      ))}
    </div>
  );
}
