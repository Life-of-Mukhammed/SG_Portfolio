"use client";

import { motion } from "framer-motion";

function formatCompactDollars(value: number) {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    const fixed = m >= 100 ? m.toFixed(0) : m.toFixed(1);
    return `$${fixed.replace(/\.0$/, "")}MLN`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}

export function PortfolioStats({
  totalFunding,
  totalProjects,
}: {
  totalFunding?: number;
  totalProjects?: number;
}) {
  const display =
    typeof totalFunding === "number" && totalFunding > 0
      ? `${formatCompactDollars(totalFunding)}+`
      : "$3MLN+";
  return (
    <section className="container py-14 md:py-20">
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-[34px] sm:text-[44px] md:text-[58px] font-extrabold tracking-tight leading-[1.05] text-balance"
        >
          Muvaffaqiyatli loyihalar:
          <br className="hidden sm:block" /> mijozlarimiz uchun{" "}
          <span className="relative inline-block">
            <span
              className="relative z-10 tabular-nums"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-deep)) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {display}
            </span>
            <span className="absolute inset-x-0 bottom-1 h-3 md:h-4 bg-brand/20 rounded-md -z-0" />
          </span>{" "}
          investitsiya jalb qilingan
        </motion.h2>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-brand/60 to-transparent"
        />
      </div>
    </section>
  );
}
