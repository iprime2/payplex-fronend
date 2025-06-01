import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeLogoUrl(logoPath: string) {
  const filename = logoPath.split('\\').pop()?.split('/').pop();
  return `http://localhost:5000/uploads/logos/${filename}`;
}
