import React, { useState } from "react";
import { ArrowRight } from "reicon-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const InteractiveHoverButton = React.forwardRef(
  ({ text = "Button", className, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#EF5F18] px-6 py-3.5 text-center font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none shadow-md",
          className
        )}
        {...props}
      >
        {/* Background Expanding Circle (Navy) */}
        <motion.div
          className="absolute rounded-full bg-[#251a65] pointer-events-none"
          initial={{ width: 0, height: 0 }}
          animate={{
            width: isHovered ? "100%" : 0,
            height: isHovered ? "100%" : 0,
            scale: isHovered ? 4.5 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            zIndex: 0,
          }}
        />

        {/* Text Container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full text-white">
          {/* Default Text (fades out and slides right on hover) */}
          <motion.div
            className="flex items-center gap-2"
            animate={{
              opacity: isHovered ? 0 : 1,
              x: isHovered ? 24 : 0,
            }}
            transition={{ duration: 0.25 }}
          >
            <span className="font-semibold text-white">
              {text || children}
            </span>
          </motion.div>

          {/* Hover Text (fades in and slides in from left on hover) */}
          <motion.div
            className="absolute flex items-center justify-center gap-2 text-white"
            initial={{ opacity: 0, x: -24 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -24,
            }}
            transition={{ duration: 0.25 }}
          >
            <span className="font-semibold text-white">{text || children}</span>
            <ArrowRight size={18} />
          </motion.div>
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";
