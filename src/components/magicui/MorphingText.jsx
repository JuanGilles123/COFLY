import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export function MorphingText({ texts, className }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2800); // Change word every 2.8s
    return () => clearInterval(interval);
  }, [texts]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden flex items-center justify-center md:justify-start",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="inline-block w-full text-current"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

MorphingText.displayName = "MorphingText";
