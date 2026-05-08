"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@startupgarage.io");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await api.login(email, password);
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setErr((e as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots" />
        <div className="glow-spot top-1/3 left-1/3 h-96 w-96 bg-brand/35" />
        <div className="glow-spot bottom-1/4 right-1/3 h-80 w-80 bg-accent/30" />
      </div>

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size={42} />
          <h1 className="mt-4 font-display text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-muted">
            Manage Startup Garage portfolio
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-6 shadow-lift"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-subtle" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            {err && (
              <div className="flex items-start gap-2 rounded-lg bg-danger/10 border border-danger/30 px-3 py-2 text-xs text-danger">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {err}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in
            </Button>

            <p className="text-[11px] text-center text-subtle">
              Default seeded admin: <span className="font-mono">admin@startupgarage.io</span> /{" "}
              <span className="font-mono">garage2026</span>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
