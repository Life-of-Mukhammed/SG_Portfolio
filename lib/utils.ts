import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function trimZero(s: string) {
  return s.replace(/\.0$/, "");
}

export function formatCurrency(value: number, opts?: { compact?: boolean }) {
  const compact = opts?.compact ?? value >= 10_000;
  if (compact) {
    if (value >= 1_000_000_000) {
      return `$${trimZero((value / 1_000_000_000).toFixed(1))}B`;
    }
    if (value >= 1_000_000) {
      return `$${trimZero((value / 1_000_000).toFixed(1))}M`;
    }
    if (value >= 1_000) {
      return `$${trimZero((value / 1_000).toFixed(1))}K`;
    }
    return `$${value}`;
  }
  // Standard format — deterministic across server/client
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatNumber(value: number) {
  if (value >= 1_000_000_000) {
    return `${trimZero((value / 1_000_000_000).toFixed(1))}B`;
  }
  if (value >= 1_000_000) {
    return `${trimZero((value / 1_000_000).toFixed(1))}M`;
  }
  if (value >= 10_000) {
    return `${trimZero((value / 1_000).toFixed(1))}K`;
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
