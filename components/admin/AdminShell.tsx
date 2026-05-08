"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { api } from "@/lib/api";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/projects/new", label: "Add project", icon: PlusCircle },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await api.logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="-mt-16 min-h-screen bg-bg flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface/70 backdrop-blur-xl">
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Logo height={26} />
          <div className="text-[10px] text-subtle tracking-[0.18em] uppercase font-bold">
            Admin
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-brand text-brand-fg shadow-[0_8px_22px_-8px_hsl(var(--brand)/0.55)]"
                    : "text-muted hover:text-fg hover:bg-fg/5",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between gap-4 px-5 border-b border-border bg-bg/70 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-xs text-muted hover:text-fg">
              ← Back to site
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className="lg:hidden h-9 px-3 rounded-xl border border-border text-xs font-medium"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
