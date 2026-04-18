import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely.
 * Solves specificity issues when overriding classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
