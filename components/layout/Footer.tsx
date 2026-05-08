"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Send, Linkedin, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden bg-brand text-brand-fg">
      {/* Background flourishes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-32 select-none">
          <span className="font-display text-[280px] md:text-[400px] font-extrabold leading-none tracking-tighter text-white/[0.05]">
            SG
          </span>
        </div>
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container relative">
        <div className="grid gap-10 py-14 md:py-16 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-3">
            <Logo height={42} variant="white" />
            <div className="mt-7 text-[13px] text-white/85">
              <div className="text-[12px] font-bold text-white">Telefon raqam</div>
              <a
                href="tel:+998781137172"
                className="mt-1.5 block font-bold text-[15px] tabular-nums hover:underline"
              >
                +998 78 113 71 72
              </a>
            </div>
            <div className="mt-5 text-[12.5px] text-white/70">
              Tashkent · Doha · Casablanca
            </div>
          </div>

          <FooterCol
            title="Havolalar"
            className="md:col-span-2"
            links={[
              { href: "https://startupgarage.uz/", label: "Startup Garage", external: true },
              { href: "https://sgfounders.school/", label: "Founders School", external: true },
              { href: "https://startupgarage.uz/uz/imkon", label: "Imkon Founders", external: true },
              { href: "https://startupgarage.uz/uz/virtualoffice", label: "Virtual Ofis", external: true },
              { href: "https://startupgarage.uz/uz/books", label: "Kitoblar", external: true },
            ]}
          />

          <FooterCol
            title="Resurslar"
            className="md:col-span-2"
            links={[
              { href: "https://startupgarage.uz/uz/media", label: "Media", external: true },
              { href: "/", label: "Portfolio" },
              { href: "https://startupgarage.uz/uz/blog", label: "Blog", external: true },
              { href: "#", label: "Maxfiylik siyosati" },
            ]}
          />

          <FooterCol
            title="Ekosistema"
            className="md:col-span-2"
            links={[
              { href: "https://startupgarage.uz/uz/branches", label: "Filiallar 🇺🇿 🇮🇹 🇲🇦", external: true },
              { href: "https://sgmicro.studio/", label: "Micro Studio", external: true },
              { href: "https://sgmicro.studio/", label: "Startup Garage Morocco", external: true },
              { href: "https://sgmena.framer.website/", label: "Startup Garage MENA", external: true },
            ]}
          />

          {/* Address + apps + socials */}
          <div className="md:col-span-3">
            <h4 className="text-[12px] font-bold text-white">Manzil</h4>
            <p className="mt-3 text-[13px] text-white/85 leading-relaxed">
              Toshkent shahar, Mirzo Ulug'bek tumani, Oq terak ko'chasi, 13-uy.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 hover:bg-black/55 transition-colors px-3 py-2"
              >
                <AppleIcon className="h-5 w-5 text-white" />
                <span className="leading-none">
                  <span className="block text-[8.5px] uppercase tracking-[0.12em] text-white/70">
                    Download on the
                  </span>
                  <span className="block text-[12px] font-extrabold text-white -mt-0.5">
                    App Store
                  </span>
                </span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 hover:bg-black/55 transition-colors px-3 py-2"
              >
                <GooglePlayIcon className="h-5 w-5" />
                <span className="leading-none">
                  <span className="block text-[8.5px] uppercase tracking-[0.12em] text-white/70">
                    Android app on
                  </span>
                  <span className="block text-[12px] font-extrabold text-white -mt-0.5">
                    Google Play
                  </span>
                </span>
              </a>
            </div>

            <div className="mt-5 flex gap-2">
              <SocialBtn href="#" label="Telegram">
                <Send className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href="#" label="YouTube">
                <Youtube className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href="#" label="LinkedIn">
                <Linkedin className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href="#" label="Instagram">
                <Instagram className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href="#" label="X">
                <XIcon className="h-3.5 w-3.5" />
              </SocialBtn>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-[11.5px] text-white/70">
            <span>
              Copyright © {new Date().getFullYear()} Startup Garage. All rights reserved.
            </span>
            <Link href="/admin" className="hover:text-white text-[10px] uppercase tracking-[0.18em]">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="text-[12px] font-bold text-white">{title}</h4>
      <ul className="mt-4 space-y-3 text-[13px]">
        {links.map((l) =>
          l.external ? (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-white/85 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-white/85 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

function SocialBtn({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
    >
      {children}
    </a>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.05 20.28c-.98.95-2.05.94-3.08.49-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.49C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M3 1.5l11.5 10.5L3 22.5V1.5z"
        fill="#0F9D58"
      />
      <path d="M3 1.5L18.5 10 14.5 12 3 1.5z" fill="#F4B400" />
      <path d="M3 22.5L14.5 12 18.5 14 3 22.5z" fill="#DB4437" />
      <path d="M14.5 12l4-2 3 1.4c1.5.85 1.5 2.4 0 3.2l-3 1.4-4-4z" fill="#4285F4" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2H21.5l-7.55 8.626L23 22h-6.66l-5.214-6.81L5.13 22H1.872l8.07-9.222L1 2h6.844l4.713 6.214L18.244 2zm-1.166 18.05h1.79L7.04 3.85h-1.93L17.078 20.05z" />
    </svg>
  );
}
