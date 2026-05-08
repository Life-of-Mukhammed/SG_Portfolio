import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://startupgarage.io"),
  title: {
    default: "Startup Garage — Where founders build the future",
    template: "%s · Startup Garage",
  },
  description:
    "Startup Garage is the operating system for the next generation of founders: a portfolio of category-defining startups, builder programs, and an ecosystem that turns ideas into companies.",
  keywords: [
    "startup",
    "venture studio",
    "Uzbekistan",
    "Central Asia",
    "founders",
    "portfolio",
  ],
  openGraph: {
    title: "Startup Garage",
    description: "Where founders build the future.",
    type: "website",
    url: "https://startupgarage.io",
  },
  twitter: { card: "summary_large_image", title: "Startup Garage" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d12" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable}`}
    >
      <body className="min-h-screen bg-bg text-fg antialiased">
        <Providers>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
