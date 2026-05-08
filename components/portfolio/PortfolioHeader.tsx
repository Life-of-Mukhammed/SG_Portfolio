"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, GitBranch, Play, Rocket } from "lucide-react";

export function PortfolioHeader() {
  return (
    <header className="relative pt-4 md:pt-6">
      <div className="container">
        <div
          className="relative overflow-hidden rounded-[28px] md:rounded-[40px] text-brand-fg"
          style={{ background: "hsl(252 84% 58%)" }}
        >
          {/* Background SG monogram */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <span
              className="absolute right-[-50px] top-1/2 -translate-y-1/2 font-display font-extrabold leading-none tracking-tighter text-white/[0.09]"
              style={{ fontSize: "clamp(260px, 42vw, 520px)" }}
            >
              SG
            </span>
            <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative px-5 sm:px-8 md:px-12 py-10 md:py-14">
            <div className="max-w-[640px]">
              {/* Floating tabs */}
              <div className="flex items-center gap-2 ml-7 md:ml-10 -mb-3 relative z-10">
                <span className="flex h-9 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.25)]">
                  <Camera className="h-4 w-4 text-fg/70" />
                </span>
                <span
                  className="flex h-9 w-14 items-center justify-center rounded-2xl shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)]"
                  style={{ background: "hsl(252 70% 42%)" }}
                >
                  <GitBranch className="h-4 w-4 text-white" />
                </span>
              </div>

              {/* Headline white card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="rounded-[24px] bg-bg text-fg px-6 sm:px-8 pt-7 pb-7 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.25)]"
              >
                <h1 className="font-display font-extrabold tracking-tight leading-[1.02] text-[34px] sm:text-[40px] md:text-[48px] whitespace-nowrap">
                  <span className="text-fg">G'OYADAN</span>
                  <span className="text-brand"> — BIZNESGACHA</span>
                </h1>
                <p className="mt-4 text-[14px] sm:text-[15px] text-muted leading-[1.6] flex items-start gap-2">
                  <Rocket className="mt-0.5 h-4 w-4 text-brand shrink-0" />
                  <span>
                    <span className="font-bold text-fg">18 oy ichida</span>{" "}
                    startapingizni barqaror biznesga aylantirishingizga professional
                    yordam beramiz.
                  </span>
                </p>
              </motion.div>

              {/* CTA + Video row */}
              <div className="mt-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-4">
                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col items-center sm:items-stretch sm:flex-1 max-w-[260px]"
                >
                  <a
                    href="https://startupgarage.io"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex w-full items-center justify-between gap-4 h-[68px] px-5 rounded-[22px] text-white text-[14px] font-bold shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-transform"
                    style={{ background: "hsl(252 70% 42%)" }}
                  >
                    <span className="leading-[1.2] text-center flex-1">
                      Rezidentlikka
                      <br />
                      ro'yxatdan o'tish
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition-colors shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                  <p className="mt-3 text-center text-[11.5px] text-white/85 leading-snug px-1">
                    Startapingizga qanday yordam bera
                    <br className="hidden sm:block" /> olishimizni bilib oling
                  </p>
                </motion.div>

                {/* Video */}
                <motion.a
                  href="#"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="group flex flex-col items-center"
                >
                  <div className="relative h-[110px] w-[200px] sm:w-[230px] overflow-hidden rounded-2xl ring-2 ring-white/30 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.5)]">
                    {/* Sky gradient */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, #b8c5ff 0%, #d6dcf2 50%, #ecedf5 100%)",
                      }}
                    />
                    {/* Building silhouettes */}
                    <svg
                      className="absolute inset-x-0 bottom-0 w-full h-[78%]"
                      viewBox="0 0 230 90"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9ba8d6" />
                          <stop offset="100%" stopColor="#6e7eb0" />
                        </linearGradient>
                      </defs>
                      <rect x="0" y="40" width="60" height="50" fill="url(#bld)" />
                      <rect x="64" y="20" width="78" height="70" fill="#7d8cc4" />
                      <rect x="146" y="32" width="54" height="58" fill="url(#bld)" />
                      <rect x="204" y="44" width="26" height="46" fill="#8593c5" />
                      {/* Windows */}
                      {Array.from({ length: 18 }).map((_, i) => {
                        const col = i % 6;
                        const row = Math.floor(i / 6);
                        return (
                          <rect
                            key={i}
                            x={70 + col * 12}
                            y={28 + row * 11}
                            width="6"
                            height="5"
                            fill="#e0e6ff"
                            opacity={0.7}
                          />
                        );
                      })}
                    </svg>
                    {/* Foreground tint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform">
                        <Play
                          className="h-4 w-4 ml-0.5"
                          style={{ color: "hsl(252 70% 42%)", fill: "hsl(252 70% 42%)" }}
                        />
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 max-w-[230px] text-center text-[11.5px] text-white/85 leading-snug">
                    Ochilish marosimidan videolavhani tomosha qiling
                  </p>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
