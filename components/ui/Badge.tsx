import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        "border-border bg-elevated/60 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-1.5 w-1.5 rounded-full bg-current",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full bg-current animate-pulse-ring" />
    </span>
  );
}
