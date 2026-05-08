"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Rocket, Sparkles } from "lucide-react";

export function PortfolioCTA() {
  return (
    <section className="container pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] md:rounded-[36px] bg-brand text-brand-fg"
      >
        {/* Layered ambient depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 font-display font-extrabold leading-none tracking-tighter text-white/[0.07]"
            style={{ fontSize: "clamp(180px, 28vw, 360px)" }}
          >
            SG
          </span>
          <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative px-7 py-12 md:px-12 md:py-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
              <Sparkles className="h-3 w-3" />
              Rezidentlik dasturi
            </div>
            <h3 className="mt-5 font-display text-[30px] sm:text-[40px] md:text-[48px] font-extrabold tracking-tight leading-[1.05] text-balance">
              Sizning startapingiz
              <br className="hidden sm:block" /> bizning portfolio'imizda
            </h3>
            <p className="mt-5 max-w-xl text-[14.5px] md:text-[15px] text-white/85 leading-relaxed">
              18 oy ichida g'oyani barqaror biznesga aylantiramiz. Mentorlik,
              investitsiya va ekosistema — barchasi bir joyda.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <a
              href="https://resident.startupgarage.uz/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-between gap-4 w-full lg:w-auto h-16 px-6 rounded-2xl text-[14.5px] md:text-[15px] font-bold transition-transform hover:scale-[1.02] active:scale-[0.99]"
              style={{
                background: "white",
                color: "hsl(252 70% 42%)",
                boxShadow: "0 22px 50px -18px rgba(0,0,0,0.35)",
              }}
            >
              <span className="flex items-center gap-2.5">
                <Rocket className="h-4 w-4" />
                Rezidentlikka ariza topshirish
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors group-hover:scale-110"
                style={{ background: "hsl(252 70% 42%)", color: "white" }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <p className="text-[12px] text-white/80 leading-snug lg:text-right">
              Bepul · Onlayn ariza · 24 soat ichida javob
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
