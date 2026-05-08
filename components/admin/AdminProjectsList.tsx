"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  LayoutGrid,
  Rows3,
  Star,
  Pencil,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/project/StatusPill";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function AdminProjectsList() {
  const qc = useQueryClient();
  const [view, setView] = React.useState<"table" | "card">("table");
  const [q, setQ] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => api.listProjects(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["admin", "projects"] });
      const prev = qc.getQueryData<{ data: Project[] }>(["admin", "projects"]);
      qc.setQueryData<{ data: Project[] }>(["admin", "projects"], (old) =>
        old ? { data: old.data.filter((p) => p.id !== id) } : old,
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin", "projects"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const toggleFeature = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      api.updateProject(id, { featured }),
    onMutate: async ({ id, featured }) => {
      await qc.cancelQueries({ queryKey: ["admin", "projects"] });
      const prev = qc.getQueryData<{ data: Project[] }>(["admin", "projects"]);
      qc.setQueryData<{ data: Project[] }>(["admin", "projects"], (old) =>
        old
          ? {
              data: old.data.map((p) =>
                p.id === id ? { ...p, featured } : p,
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin", "projects"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const projects = data?.data ?? [];
  const filtered = q
    ? projects.filter((p) =>
        [p.name, p.tagline, p.category, p.founderName]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
    : projects;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Boshqaruv
          </div>
          <h1 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-muted mt-1">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"} ·
            jami {projects.length}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-subtle" />
            <Input
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 w-56"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-elevated/60 p-1">
            <button
              aria-label="Table view"
              onClick={() => setView("table")}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                view === "table"
                  ? "bg-fg text-bg shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </button>
            <button
              aria-label="Card view"
              onClick={() => setView("card")}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                view === "card"
                  ? "bg-fg text-bg shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
          <Link href="/admin/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              New project
            </Button>
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="h-4 w-32 rounded bg-elevated animate-pulse" />
          <div className="mt-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-elevated/60 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        {!isLoading && view === "table" && (
          <motion.div
            key="table"
            layout
            className="rounded-2xl border border-border bg-surface overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-elevated/40 text-left text-[10.5px] uppercase tracking-[0.16em] text-subtle">
                  <th className="px-5 py-3.5 font-bold">Project</th>
                  <th className="px-4 py-3.5 font-bold hidden md:table-cell">Status</th>
                  <th className="px-4 py-3.5 font-bold hidden lg:table-cell">Funding</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <motion.tr
                    layout
                    key={p.id}
                    className="group border-b border-border last:border-0 hover:bg-elevated/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 relative">
                      <span
                        className="absolute left-0 inset-y-3 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: p.accentColor }}
                      />
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${p.accentColor}, ${p.accentColor}c0)`,
                            boxShadow: `0 8px 18px -8px ${p.accentColor}80`,
                          }}
                        >
                          {p.name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold truncate flex items-center gap-2">
                            {p.name}
                            {p.featured && (
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <div
                            className="text-[10.5px] font-bold uppercase tracking-[0.14em] mt-0.5"
                            style={{ color: p.accentColor }}
                          >
                            {p.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell tabular-nums font-bold">
                      {formatCurrency(p.funding, { compact: true })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          title={p.featured ? "Unfeature" : "Feature"}
                          onClick={() =>
                            toggleFeature.mutate({ id: p.id, featured: !p.featured })
                          }
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center hover:bg-fg/5 transition-colors",
                            p.featured ? "text-amber-500" : "text-muted",
                          )}
                        >
                          <Star className={cn("h-3.5 w-3.5", p.featured && "fill-current")} />
                        </button>
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-fg hover:bg-fg/5 transition-colors"
                          title="View public page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/projects/${p.id}`}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-fg hover:bg-fg/5 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${p.name}?`)) remove.mutate(p.id);
                          }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-muted">No projects.</div>
            )}
          </motion.div>
        )}

        {!isLoading && view === "card" && (
          <motion.div
            key="cards"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((p) => (
              <motion.div
                layout
                key={p.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all hover:border-transparent"
                style={{ boxShadow: `0 0 0 transparent` }}
              >
                <div
                  className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                  style={{ background: p.accentColor }}
                />

                <div className="relative flex items-start gap-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${p.accentColor}, ${p.accentColor}c0)`,
                      boxShadow: `0 10px 22px -10px ${p.accentColor}80`,
                    }}
                  >
                    {p.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold truncate flex items-center gap-1.5">
                      {p.name}
                      {p.featured && (
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-muted truncate">{p.tagline}</div>
                  </div>
                  <StatusPill status={p.status} />
                </div>

                <div
                  className="relative mt-4 rounded-xl border p-3"
                  style={{
                    background: `linear-gradient(135deg, ${p.accentColor}14, ${p.accentColor}05)`,
                    borderColor: `${p.accentColor}30`,
                  }}
                >
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: p.accentColor }}
                  >
                    Funding
                  </div>
                  <div className="mt-0.5 text-base font-extrabold tabular-nums">
                    {formatCurrency(p.funding, { compact: true })}
                  </div>
                </div>

                <div
                  className="relative mt-3 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    color: p.accentColor,
                    background: `${p.accentColor}14`,
                  }}
                >
                  {p.category}
                </div>

                <div className="relative mt-4 flex items-center justify-end gap-1.5 border-t border-border pt-3">
                  <button
                    onClick={() =>
                      toggleFeature.mutate({ id: p.id, featured: !p.featured })
                    }
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center hover:bg-fg/5 transition-colors",
                      p.featured ? "text-amber-500" : "text-muted",
                    )}
                  >
                    <Star className={cn("h-3.5 w-3.5", p.featured && "fill-current")} />
                  </button>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="h-8 px-3 rounded-lg text-xs font-bold border border-border hover:border-brand/40 inline-flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${p.name}?`)) remove.mutate(p.id);
                    }}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-danger hover:bg-danger/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
