import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number | null | undefined,
  decimals = 2
): string {
  if (bytes === null || typeof bytes === "undefined" || bytes < 0) {
    return "0 Bytes";
  }
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  const unit = sizes[i] !== undefined ? sizes[i] : "Bytes";

  return formattedSize + " " + unit;
}
