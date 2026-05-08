"use client";

import * as React from "react";

export function Logo({
  height,
  size,
  variant,
  className,
}: {
  height?: number;
  /** Backwards-compat alias for height */
  size?: number;
  variant?: "color" | "white" | "dark";
  className?: string;
}) {
  height = height ?? size ?? 32;
  // Aspect ratio of the SVG: 1181x409 ≈ 2.887
  const width = Math.round(height * (1181 / 409));

  // Pick source based on variant — auto-detect via theme by default (white logo on dark, dark on light)
  let src = "/sg-logo.svg";
  if (variant === "white") src = "/sg-logo-white.svg";
  if (variant === "dark") src = "/sg-logo-dark.svg";

  if (!variant) {
    return (
      <span
        className={className}
        style={{ display: "inline-block", height, width }}
      >
        {/* Light theme: full color (SG mark purple + dark wordmark) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sg-logo.svg"
          alt="Startup Garage"
          height={height}
          width={width}
          className="block dark:hidden"
          style={{ height, width }}
        />
        {/* Dark theme: white wordmark + purple SG mark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sg-logo-white.svg"
          alt="Startup Garage"
          height={height}
          width={width}
          className="hidden dark:block"
          style={{ height, width }}
        />
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt="Startup Garage"
      height={height}
      width={width}
      className={className}
      style={{ height, width }}
    />
  );
}
