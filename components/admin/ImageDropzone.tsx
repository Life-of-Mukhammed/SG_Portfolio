"use client";

import * as React from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageDropzone({
  value,
  onChange,
  multiple = false,
  hint,
}: {
  value: string | string[] | null | undefined;
  onChange: (next: string | string[] | null) => void;
  multiple?: boolean;
  hint?: string;
}) {
  const [drag, setDrag] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const values = multiple
    ? (Array.isArray(value) ? value : [])
    : value
      ? [value as string]
      : [];

  async function uploadOne(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `Upload failed (${res.status})`);
    }
    const json = (await res.json()) as { url: string };
    return json.url;
  }

  async function handleFiles(files: FileList | File[]) {
    setError(null);
    setBusy(true);
    try {
      const arr = Array.from(files);
      const uploaded: string[] = [];
      for (const f of arr) uploaded.push(await uploadOne(f));
      if (multiple) {
        onChange([...(values as string[]), ...uploaded]);
      } else {
        onChange(uploaded[0] ?? null);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function removeAt(idx: number) {
    if (multiple) {
      const next = (values as string[]).filter((_, i) => i !== idx);
      onChange(next);
    } else {
      onChange(null);
    }
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
          "py-8 px-4 text-center",
          drag
            ? "border-brand bg-brand/5"
            : "border-border bg-elevated/40 hover:border-brand/40 hover:bg-elevated",
        )}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          multiple={multiple}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {busy ? (
          <Loader2 className="h-5 w-5 text-muted animate-spin" />
        ) : (
          <Upload className="h-5 w-5 text-muted" />
        )}
        <div className="text-sm font-medium">
          Drop {multiple ? "files" : "a file"} or <span className="text-brand">browse</span>
        </div>
        <div className="text-[11px] text-subtle">
          {hint || "PNG, JPG, WebP, SVG up to 6MB"}
        </div>
      </label>

      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}

      {values.length > 0 && (
        <div className={cn("mt-3 grid gap-2", multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1")}>
          {values.map((url, i) => (
            <div
              key={url + i}
              className="group relative aspect-video rounded-lg overflow-hidden border border-border bg-elevated"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-bg/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
