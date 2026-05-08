"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency } from "@/lib/utils";

export function ProjectCardFeatured({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block overflow-hidden rounded-[28px] border border-border bg-surface"
      >
        {/* Accent washes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl transition-opacity duration-500 group-hover:opacity-30"
            style={{ background: project.accentColor }}
          />
          <div
            className="absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full opacity-[0.12] blur-3xl transition-opacity duration-500 group-hover:opacity-25"
            style={{ background: project.accentColor }}
          />
          <div className="absolute inset-0 bg-dots opacity-40" />
        </div>

        <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: identity + story */}
          <div className="lg:col-span-7">
            <div className="flex items-start gap-4">
              {project.logoUrl ? (
                <div
                  className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl"
                  style={{
                    boxShadow: `0 14px 32px -10px ${project.accentColor}80`,
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
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}c0)`,
                    boxShadow: `0 14px 32px -10px ${project.accentColor}80`,
                  }}
                >
                  {project.name[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: project.accentColor,
                    borderColor: `${project.accentColor}40`,
                    background: `${project.accentColor}12`,
                  }}
                >
                  {project.category}
                </span>
                <h3 className="mt-2 font-display text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.05] text-balance">
                  {project.name}
                </h3>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-[15px] text-muted leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Right: investment + founder */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div
              className="relative overflow-hidden rounded-2xl p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}d0)`,
                boxShadow: `0 24px 60px -24px ${project.accentColor}90`,
              }}
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/80">
                  Investitsiya jalb qilingan
                </span>
              </div>

              <div className="relative mt-4 font-display text-[44px] md:text-[52px] font-extrabold tracking-tight tabular-nums leading-none">
                {formatCurrency(project.funding, { compact: true })}
              </div>
              <div className="relative mt-1.5 text-[12px] font-medium text-white/85">
                {formatCurrency(project.funding)}
              </div>
            </div>

            <div className="relative rounded-2xl border border-border bg-elevated/60 p-5 backdrop-blur-sm">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-subtle">
                Founder
              </div>
              <div className="mt-3 flex items-center gap-3.5">
                <Avatar
                  name={project.founderName}
                  src={project.founderAvatar}
                  size={48}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base font-extrabold tracking-tight truncate">
                    {project.founderName}
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted leading-snug">
                    {project.name} asoschisi
                  </div>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg group-hover:text-brand transition-colors">
                Batafsil ko'rish
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
