"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatCurrency } from "@/lib/utils";

export function ProjectCardStandard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5",
          "transition-all duration-300",
          "hover:border-transparent",
          "hover:shadow-[0_28px_60px_-28px_hsl(var(--brand)/0.45)]",
        )}
      >
        {/* Accent glow on hover */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: project.accentColor }}
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
          style={{ background: project.accentColor }}
        />

        <header className="relative flex items-start justify-between gap-3">
          {project.logoUrl ? (
            <div
              className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-105"
              style={{
                boxShadow: `0 12px 26px -10px ${project.accentColor}80`,
              }}
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
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold text-white transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}c0)`,
                boxShadow: `0 12px 26px -10px ${project.accentColor}80`,
              }}
            >
              {project.name[0]}
            </div>
          )}
          <span
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              color: project.accentColor,
              borderColor: `${project.accentColor}40`,
              background: `${project.accentColor}0d`,
            }}
          >
            {project.category}
          </span>
        </header>

        <div className="relative mt-5 flex-1">
          <h3 className="font-display text-lg font-extrabold tracking-tight">
            {project.name}
          </h3>
          <p className="mt-2 text-[12.5px] text-muted line-clamp-4 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Investment hero */}
        <div
          className="relative mt-5 overflow-hidden rounded-xl border p-4"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}14, ${project.accentColor}06)`,
            borderColor: `${project.accentColor}30`,
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: project.accentColor }}
          >
            Investitsiya
          </span>
          <div className="mt-1 font-display text-2xl font-extrabold tracking-tight tabular-nums">
            {formatCurrency(project.funding, { compact: true })}
          </div>
        </div>

        <footer className="relative mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={project.founderName} src={project.founderAvatar} size={30} />
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold truncate">
                {project.founderName}
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-subtle">
                Founder
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-fg/80 group-hover:text-brand transition-colors">
            Batafsil
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </footer>
      </Link>
    </motion.article>
  );
}
