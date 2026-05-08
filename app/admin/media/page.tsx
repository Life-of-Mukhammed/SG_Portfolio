"use client";

import * as React from "react";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { Copy, Check } from "lucide-react";

export default function MediaPage() {
  const [items, setItems] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState<string | null>(null);

  function copy(url: string) {
    void navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Media</h1>
        <p className="text-sm text-muted mt-1">
          Drag & drop assets to upload. URLs are returned for use in projects.
        </p>
      </div>

      <ImageDropzone
        multiple
        value={items}
        onChange={(v) => setItems((v as string[]) ?? [])}
        hint="Drop multiple files — uploaded to /public/uploads"
      />

      {items.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-xs text-muted mb-3">Uploaded URLs</div>
          <ul className="space-y-2">
            {items.map((url) => (
              <li
                key={url}
                className="flex items-center gap-3 rounded-lg border border-border bg-elevated/40 px-3 py-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} className="h-9 w-9 rounded-md object-cover" alt="" />
                <code className="flex-1 text-xs font-mono truncate">{url}</code>
                <button
                  onClick={() => copy(url)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-fg/5"
                >
                  {copied === url ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
