"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: { label: string; href: string; description?: string }[];
};

const NAV: NavItem[] = [
  { label: "Startup Garage", href: "https://startupgarage.uz/", external: true },
  {
    label: "Founders Community",
    href: "https://sgfounders.school/?utm_source=startupgarage",
    external: true,
  },
  {
    label: "Kompaniya",
    href: "#kompaniya",
    children: [
      { label: "Micro Studio", href: "https://sgmicro.studio/" },
      { label: "Imkon Founders", href: "https://startupgarage.uz/uz/imkon" },
      { label: "Virtual Ofis", href: "https://startupgarage.uz/uz/virtualoffice" },
      { label: "Media", href: "https://startupgarage.uz/uz/media" },
      { label: "Filiallar", href: "https://startupgarage.uz/uz/branches" },
      { label: "Kitoblar", href: "https://startupgarage.uz/uz/books" },
    ],
  },
  { label: "Portfolio", href: "/" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg/85 backdrop-blur-xl border-b border-border/70"
          : "bg-bg border-b border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-6 md:gap-10">
          <a
            href="https://startupgarage.uz/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center shrink-0"
          >
            <Logo height={34} />
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpen = openDropdown === item.label;

            if (hasChildren) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 px-3.5 py-2 text-[14px] font-medium rounded-lg transition-colors",
                      isOpen ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 top-full pt-2"
                      >
                        <div className="w-72 rounded-2xl border border-border bg-surface/95 backdrop-blur-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18)] p-2">
                          {item.children!.map((child) => {
                            const childExternal = child.href.startsWith("http");
                            return (
                              <a
                                key={child.label}
                                href={child.href}
                                target={childExternal ? "_blank" : undefined}
                                rel={childExternal ? "noreferrer" : undefined}
                                onClick={() => setOpenDropdown(null)}
                                className="block rounded-xl px-3 py-2.5 hover:bg-fg/[0.04] transition-colors"
                              >
                                <div className="text-[13.5px] font-semibold text-fg">
                                  {child.label}
                                </div>
                                {child.description && (
                                  <div className="mt-0.5 text-[12px] text-muted">
                                    {child.description}
                                  </div>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                pathname={pathname ?? ""}
                external={item.external}
              />
            );
          })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="https://startupgarage.uz/"
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex items-center justify-center h-10 px-5 rounded-full text-[13.5px] font-semibold",
              "bg-brand text-brand-fg hover:bg-brand-deep",
              "shadow-[0_8px_24px_-8px_hsl(var(--brand)/0.55)]",
              "transition-all hover:scale-[1.02] active:scale-95",
            )}
          >
            Rezident bo'lish
          </a>

          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-elevated"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-bg"
        >
          <div className="container py-3 flex flex-col">
            {NAV.map((item) => (
              <React.Fragment key={item.label}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-semibold border-b border-border last:border-0"
                >
                  {item.label}
                </a>
                {item.children?.map((c) => {
                  const ext = c.href.startsWith("http");
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target={ext ? "_blank" : undefined}
                      rel={ext ? "noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="py-2.5 pl-4 text-[13px] text-muted border-b border-border last:border-0"
                    >
                      {c.label}
                    </a>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}

function NavLink({
  href,
  label,
  pathname,
  external,
}: {
  href: string;
  label: string;
  pathname: string;
  external?: boolean;
}) {
  const isHash = href.startsWith("#");
  const active = isHash || external
    ? false
    : pathname === href || (href !== "/" && pathname.startsWith(href));
  const Tag = isHash || external ? "a" : Link;
  return (
    <Tag
      href={href as never}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-1 px-3.5 py-2 text-[14px] font-medium transition-colors",
        active ? "text-fg" : "text-muted hover:text-fg",
      )}
    >
      <span>{label}</span>
    </Tag>
  );
}
