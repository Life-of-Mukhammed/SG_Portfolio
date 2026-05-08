"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  DollarSign,
  FolderKanban,
  Star,
  Sparkles,
  Wallet,
  RefreshCw,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StatusPill } from "@/components/project/StatusPill";

export function AdminDashboard({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [syncing, setSyncing] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState<{
    total: number;
    created: number;
    updated: number;
    skipped: number;
  } | null>(null);
  const [syncError, setSyncError] = React.useState<string | null>(null);

  async function runSync() {
    setSyncing(true);
    setSyncError(null);
    try {
      const r = await fetch("/api/admin/sync-residents", { method: "POST" });
      const data = await r.json();
      if (!r.ok) {
        setSyncError(data.message || data.error || "Sync failed");
      } else {
        setSyncResult(data);
        router.refresh();
      }
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : String(e));
    } finally {
      setSyncing(false);
    }
  }

  const totalFunding = projects.reduce((s, p) => s + p.funding, 0);
  const featuredCount = projects.filter((p) => p.featured).length;
  const avgFunding = totalFunding / Math.max(1, projects.length);

  const fundingSeries = React.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let acc = totalFunding * 0.18;
    return months.map((m, i) => {
      acc = acc + (totalFunding * 0.04) * (1 + (i % 3) * 0.15);
      return { month: m, funding: Math.round(acc) };
    });
  }, [totalFunding]);

  const byCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return Array.from(map, ([category, count]) => ({ category, count }));
  }, [projects]);

  const recent = projects.slice(0, 6);

  return (
    <div className="space-y-7">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand to-brand-deep text-brand-fg p-7 md:p-9">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em]">
            <Sparkles className="h-3 w-3" />
            Admin
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-4xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-[14px] text-white/85 max-w-lg">
            Startup Garage portfolio'sining jonli holati. Loyihalarni boshqaring,
            kapitalni kuzatib boring.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={runSync}
              disabled={syncing}
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-brand-deep text-sm font-bold shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Sync qilinmoqda…" : "Rezidentlarni sync qilish"}
            </button>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/80">
              <Database className="h-3 w-3" />
              MongoDB → lokal
            </span>
            {syncResult && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 backdrop-blur-md ring-1 ring-emerald-300/40 px-3 py-1 text-[11.5px] font-bold">
                ✓ {syncResult.total} ta tekshirildi · {syncResult.created} yangi qo'shildi · {syncResult.skipped} mavjud edi
              </span>
            )}
            {syncError && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/20 backdrop-blur-md ring-1 ring-red-300/40 px-3 py-1 text-[11.5px] font-bold">
                ✗ {syncError}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Capital deployed"
          value={formatCurrency(totalFunding, { compact: true })}
          delta="+12.4% YoY"
          icon={<DollarSign className="h-4 w-4" />}
          gradient="from-violet-500 to-indigo-600"
          glow="rgba(139, 92, 246, 0.45)"
        />
        <StatCard
          label="Active companies"
          value={projects.length.toString()}
          delta={`${featuredCount} featured`}
          icon={<FolderKanban className="h-4 w-4" />}
          gradient="from-cyan-500 to-blue-600"
          glow="rgba(34, 211, 238, 0.45)"
        />
        <StatCard
          label="Avg investment"
          value={formatCurrency(avgFunding, { compact: true })}
          delta="per startup"
          icon={<Wallet className="h-4 w-4" />}
          gradient="from-emerald-500 to-teal-600"
          glow="rgba(16, 185, 129, 0.45)"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-surface p-5"
        >
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <h3 className="font-display text-base font-bold tracking-tight">Capital deployed</h3>
            <p className="text-xs text-muted">Cumulative — last 12 months</p>
          </div>
          <div className="relative mt-5 h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fundingSeries}>
                <defs>
                  <linearGradient id="brandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--brand))" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="hsl(var(--brand))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--subtle))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(var(--subtle))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCurrency(v, { compact: true })}
                />
                <Area
                  type="monotone"
                  dataKey="funding"
                  stroke="hsl(var(--brand))"
                  strokeWidth={2.5}
                  fill="url(#brandFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5"
        >
          <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <h3 className="font-display text-base font-bold tracking-tight">By category</h3>
            <p className="text-xs text-muted">Number of projects</p>
          </div>
          <div className="relative mt-5 h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" stroke="hsl(var(--subtle))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--subtle))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "hsl(var(--brand) / 0.08)" }}
                />
                <Bar dataKey="count" fill="url(#barFill)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent projects */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-display text-base font-bold tracking-tight">Recent projects</h3>
            <p className="text-xs text-muted">Latest activity in the portfolio</p>
          </div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand px-3 py-1.5 text-xs font-bold hover:bg-brand/15 transition-colors"
          >
            Manage all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {recent.map((p) => (
            <li
              key={p.id}
              className="group relative flex items-center gap-4 p-4 hover:bg-elevated/40 transition-colors"
            >
              <span
                className="absolute left-0 inset-y-3 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: p.accentColor }}
              />
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white transition-transform group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${p.accentColor}, ${p.accentColor}c0)`,
                  boxShadow: `0 10px 22px -10px ${p.accentColor}80`,
                }}
              >
                {p.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold truncate">{p.name}</span>
                  <StatusPill status={p.status} />
                  {p.featured && (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <span className="text-xs text-muted truncate">{p.tagline}</span>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <span
                  className="text-sm font-extrabold tabular-nums"
                  style={{ color: p.accentColor }}
                >
                  {formatCurrency(p.funding, { compact: true })}
                </span>
              </div>
              <Link
                href={`/admin/projects/${p.id}`}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-fg hover:border-brand/40 transition-colors"
              >
                Edit
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  icon,
  gradient,
  glow,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5"
      style={{
        boxShadow: `0 18px 40px -28px ${glow}`,
      }}
    >
      <div
        className={`absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl`}
      />
      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}
          style={{ boxShadow: `0 10px 24px -8px ${glow}` }}
        >
          {icon}
        </div>
        {delta && (
          <span className="inline-flex items-center rounded-full bg-elevated/80 px-2 py-0.5 text-[10.5px] font-bold text-muted">
            {delta}
          </span>
        )}
      </div>
      <div className="relative mt-5">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-subtle">
          {label}
        </div>
        <div className="mt-1 font-display text-3xl font-extrabold tracking-tight tabular-nums">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
