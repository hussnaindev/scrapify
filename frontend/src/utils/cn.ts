/**
 * Utility function for combining class names
 * Combines Tailwind CSS classes and handles conditional classes
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs - Class values to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
