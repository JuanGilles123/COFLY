import React, { useRef } from "react";
import { Sun, Moon } from "reicon-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { flushSync } from "react-dom";

export function AnimatedThemeToggler({ theme, toggleTheme, className }) {
  const buttonRef = useRef(null);

  const handleToggle = () => {
    const isMobile = window.innerWidth < 768;
    if (!document.startViewTransition || isMobile) {
      toggleTheme();
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className={cn(
        "theme-toggle-btn relative flex items-center justify-center overflow-hidden cursor-pointer",
        className
      )}
      aria-label="Cambiar tema"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
