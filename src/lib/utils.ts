import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact = false): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (compact) {
    if (abs >= 1_000_000) {
      const n = abs / 1_000_000;
      return `${sign}$${n >= 10 ? n.toFixed(0) : n.toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      const n = abs / 1_000;
      const digits = n >= 100 ? 0 : n >= 10 ? 0 : 1;
      return `${sign}$${n.toFixed(digits)}K`;
    }
  }
  return `${sign}$${abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPct(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}
