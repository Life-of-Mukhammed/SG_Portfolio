import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        404
      </div>
      <h1 className="mt-3 font-display text-5xl font-bold">Lost in the garage.</h1>
      <p className="mt-3 text-muted">
        The page you wanted doesn't exist — or hasn't shipped yet.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-fg text-bg text-sm font-semibold transition hover:scale-[1.03]"
      >
        Back to home
      </Link>
    </div>
  );
}
