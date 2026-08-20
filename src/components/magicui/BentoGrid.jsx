import React from "react";
import { ArrowRight } from "reicon-react";
import { cn } from "../../lib/utils";
import { BorderBeam } from "./BorderBeam";

export function BentoGrid({ children, className }) {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-12 gap-4", className)}>
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  cta,
  ...props
}) {
  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-12 flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200/50 bg-white/70 backdrop-blur-md p-6 dark:border-neutral-800/50 dark:bg-neutral-900/70 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">{background}</div>
      
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 group-hover:-translate-y-4">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75">
            <Icon size={24} />
          </div>
        )}
        <h3 className="mt-4 text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-500 dark:text-neutral-400 text-sm mt-1">{description}</p>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute bottom-4 left-6 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      >
        <span className="pointer-events-auto cursor-pointer hover:underline flex items-center gap-1">
          {cta || "Saber más"}
          <ArrowRight size={14} />
        </span>
      </div>
      
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.02] group-hover:dark:bg-white/[.01]" />
      
      <BorderBeam 
        size={250} 
        duration={8} 
        delay={2} 
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
      />
    </div>
  );
}
