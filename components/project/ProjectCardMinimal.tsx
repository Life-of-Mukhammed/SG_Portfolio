"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatCurrency } from "@/lib/utils";

export function ProjectCardMinimal({ project }: { project: Project }) {
  const accent = project.accentColor;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-surface px-4 py-3.5 pl-5",
          "transition-all duration-200 hover:border-transparent hover:shadow-[0_18px_40px_-22px_hsl(var(--brand)/0.35)]",
        )}
      >
        {/* Accent stripe */}
        <span
          className="absolute inset-y-3 left-0 w-1 rounded-r-full opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(180deg, ${accent}, ${accent}80)` }}
        />
        <span
          className="pointer-events-none absolute -right-20 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
          style={{ background: accent }}
        />

        {project.logoUrl ? (
          <div
            className="h-11 w-11 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105"
            style={{ boxShadow: `0 10px 22px -10px ${accent}80` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.logoUrl}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}c0)`,
              boxShadow: `0 10px 22px -10px ${accent}80`,
            }}
          >
            {project.name[0]}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] font-extrabold tracking-tight truncate">
              {project.name}
            </span>
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] shrink-0"
              style={{
                color: accent,
                background: `${accent}14`,
              }}
            >
              {project.category}
            </span>
          </div>
          <p className="mt-0.5 text-[12.5px] text-muted truncate leading-snug">
            {project.description}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <Avatar name={project.founderName} src={project.founderAvatar} size={26} />
          <span className="text-[12px] font-semibold text-muted truncate max-w-[140px]">
            {project.founderName}
          </span>
        </div>

        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span
            className="text-[11px] font-bold tabular-nums"
            style={{ color: accent }}
          >
            {formatCurrency(project.funding, { compact: true })}
          </span>
          <span className="text-[9.5px] uppercase tracking-[0.14em] text-subtle">
            Investitsiya
          </span>
        </div>

        <ArrowUpRight
          className="h-4 w-4 text-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: accent }}
        />
      </Link>
    </motion.div>
  );
}
