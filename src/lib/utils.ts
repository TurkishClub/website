import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// This utility function combines class names and merges Tailwind CSS classes.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
