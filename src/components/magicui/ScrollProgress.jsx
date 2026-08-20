import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

export function ScrollProgress({ className }) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-1.5 origin-left bg-gradient-to-r from-primary to-navy",
        className
      )}
      style={{
        scaleX,
      }}
    />
  );
}
