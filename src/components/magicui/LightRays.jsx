import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function LightRays({
  className,
  count = 6, // Slightly fewer but wider rays for a cleaner ambient feel
  color = "rgba(37, 26, 101, 0.25)", // Default navy blue
  blur = 140, // High blur to diffuse the edges completely
  speed = 18, // Slower, more organic speed
  length = "90vh",
  style,
  ...props
}) {
  const [rays, setRays] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const cycleDuration = Math.max(speed, 0.1);

  // Monitor resize to adjust rays for mobile viewports
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const rayCount = isMobile ? Math.min(count, 5) : count; // Up to 5 rays on mobile
    if (rayCount <= 0) {
      setRays([]);
      return;
    }

    const newRays = Array.from({ length: rayCount }, (_, index) => {
      const left = 5 + Math.random() * 90;
      const rotate = isMobile ? -8 + Math.random() * 16 : -10 + Math.random() * 20; 
      const width = isMobile 
        ? 150 + Math.random() * 150  // Slightly wider on mobile for visibility
        : 300 + Math.random() * 300; // Wider on desktop
      const swing = isMobile
        ? 0.2 + Math.random() * 0.4  // Proportional swing
        : 0.3 + Math.random() * 0.6;
      const delay = Math.random() * (isMobile ? cycleDuration * 0.5 : cycleDuration);
      
      // Accelerate duration on mobile (around 2x faster fade/animation)
      const duration = isMobile
        ? (cycleDuration * 0.45) * (0.7 + Math.random() * 0.6)
        : cycleDuration * (0.8 + Math.random() * 0.4);
        
      // Increase peak opacity on mobile to ensure visibility
      const intensity = isMobile
        ? 0.65 + Math.random() * 0.25 // Visible range 0.65 - 0.90
        : 0.45 + Math.random() * 0.35;

      return {
        id: `${index}-${Math.round(left * 10)}`,
        left,
        rotate,
        width,
        swing,
        delay,
        duration,
        intensity,
      };
    });

    setRays(newRays);
  }, [count, cycleDuration, isMobile]);

  const activeBlur = isMobile ? Math.min(blur, 60) : blur;
  const activeLength = isMobile ? "70vh" : length;

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 left-0 w-full h-[100vh] isolate overflow-hidden rounded-[inherit]",
        className
      )}
      style={{
        ...style,
      }}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft atmospheric glow spots */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 30% 15%, color-mix(in srgb, ${color} 40%, transparent), transparent 60%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 70% 10%, color-mix(in srgb, ${color} 30%, transparent), transparent 65%)`,
          }}
        />
        
        {/* Animated Light Rays */}
        {rays.map((ray) => (
          <motion.div
            key={ray.id}
            className="pointer-events-none absolute -top-[15%] origin-top -translate-x-1/2 rounded-full opacity-0 mix-blend-normal"
            style={{ 
              left: `${ray.left}%`, 
              width: `${ray.width}px`,
              height: activeLength,
              filter: `blur(${activeBlur}px)`,
              background: `linear-gradient(to bottom, color-mix(in srgb, ${color} 65%, transparent), transparent)`,
              willChange: "transform, opacity",
            }}
            initial={{ rotate: ray.rotate }}
            animate={{
              opacity: [0, ray.intensity, 0],
              rotate: [
                ray.rotate - ray.swing,
                ray.rotate + ray.swing,
                ray.rotate - ray.swing,
              ],
            }}
            transition={{
              duration: ray.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ray.delay,
              repeatDelay: ray.duration * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  );
}
