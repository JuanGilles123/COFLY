import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple CSS class names, resolving conflicts with tailwind-merge.
 * @param {...import("clsx").ClassValue} inputs - CSS class names or conditionals.
 * @returns {string} - The merged and cleaned class names string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
