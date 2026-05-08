"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, Rows3 } from "lucide-react";
import type { Project } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { ProjectCardFeatured } from "./ProjectCardFeatured";
import { ProjectCardStandard } from "./ProjectCardStandard";
import { ProjectCardMinimal } from "./ProjectCardMinimal";
import { cn } from "@/lib/utils";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = React.useState<string>("All");
  const [q, setQ] = React.useState("");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const filtered = React.useMemo(() => {
    return projects.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = [p.name, p.tagline, p.description, p.category, p.founderName]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [projects, category, q]);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const standard = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
          {CATEGORIES.map((c) => {
            const active = c === category;
            const label = c === "All" ? "Barchasi" : c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "relative shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
                  active ? "text-brand-fg" : "text-muted hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="cat-active"
                    className="absolute inset-0 rounded-full bg-brand shadow-[0_8px_22px_-8px_hsl(var(--brand)/0.55)]"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Qidirish…"
              className="h-10 w-full lg:w-64 rounded-xl border border-border bg-surface pl-9 pr-3 text-[13.5px] placeholder:text-subtle focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 transition-colors"
            />
          </div>

          <div className="flex items-center rounded-xl border border-border bg-surface p-1">
            <button
              aria-label="Grid"
              onClick={() => setView("grid")}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                view === "grid" ? "bg-brand text-brand-fg" : "text-muted hover:text-fg",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              aria-label="List"
              onClick={() => setView("list")}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                view === "list" ? "bg-brand text-brand-fg" : "text-muted hover:text-fg",
              )}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-border bg-elevated/40 px-6 py-16 text-center"
          >
            <p className="text-sm text-muted">Loyiha topilmadi.</p>
            <button
              onClick={() => {
                setCategory("All");
                setQ("");
              }}
              className="mt-3 text-xs font-semibold text-brand hover:underline"
            >
              Tozalash
            </button>
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            key="grid"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {featured && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 lg:col-span-3"
              >
                <ProjectCardFeatured project={featured} />
              </motion.div>
            )}
            {standard.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.32) }}
              >
                <ProjectCardStandard project={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" layout className="flex flex-col gap-2">
            {filtered.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.3) }}
              >
                <ProjectCardMinimal project={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
