import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    let classes = twMerge(clsx(inputs));

    // Check if we're in a browser environment and touch is primary (no hover)
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
        // Regex to match hover:, group-hover:, peer-hover: and remove them
        // This removes the class entirely if it has a hover: prefix
        classes = classes.replace(/\b(group-|peer-|gpu-)?hover:[^\s]+\s?/g, '');
    }

    return classes;
}
