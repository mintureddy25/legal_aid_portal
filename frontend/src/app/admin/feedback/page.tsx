"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Inbox, Mail, Star } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { Badge, LoadingState, Pagination, Spinner } from "@/components/ui";

interface Feedback {
  id: string;
  serviceRating: number;
  websiteRating: number;
  message: string;
  name: string | null;
  email: string | null;
  handled: boolean;
  createdAt: string;
}

const PER_PAGE = 10;

function Stars({ label, rating }: { label: string; rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-muted"
      aria-label={`${label}: ${rating} out of 5`}
    >
      <span className="font-medium text-ink">{label}</span>
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`size-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"}`}
            aria-hidden
          />
        ))}
      </span>
    </span>
  );
}

export default function AdminFeedback() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Feedback[] | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "handled">("all");
  const [page, setPage] = useState(1);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (token) setItems(await api<Feedback[]>("/feedback/admin", { token }));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  function selectFilter(f: typeof filter) {
    setFilter(f);
    setPage(1);
  }

  async function toggleHandled(m: Feedback) {
    setSavingId(m.id);
    try {
      await api(`/feedback/admin/${m.id}`, { method: "PATCH", body: { handled: !m.handled }, token });
      await load();
    } finally {
      setSavingId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!items) return [];
    if (filter === "new") return items.filter((m) => !m.handled);
    if (filter === "handled") return items.filter((m) => m.handled);
    return items;
  }, [items, filter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page],
  );
  const newCount = items?.filter((m) => !m.handled).length ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy-800">Feedback</h1>
        {newCount > 0 && (
          <Badge className="bg-navy-800 text-white ring-navy-800">{newCount} new</Badge>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">Feedback submitted from the website.</p>

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter feedback">
        {(["all", "new", "handled"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => selectFilter(f)}
            aria-pressed={filter === f}
            className={`min-h-9 rounded-lg px-3 text-sm font-medium capitalize ring-1 ring-inset transition-colors ${
              filter === f
                ? "bg-navy-800 text-white ring-navy-800"
                : "bg-white text-ink ring-line hover:ring-navy-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {items === null && <LoadingState label="Loading feedback…" />}

      {items && filtered.length === 0 && (
        <p className="mt-6 rounded-2xl bg-surface p-10 text-center text-sm text-muted ring-1 ring-line">
          <Inbox className="mx-auto mb-2 size-7 text-slate-300" aria-hidden />
          No feedback here yet.
        </p>
      )}

      <div className="mt-6 grid gap-3">
        {pageItems.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl bg-surface p-5 ring-1 ring-line ${m.handled ? "opacity-70" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <Stars label="Service" rating={m.serviceRating} />
                  <Stars label="Website" rating={m.websiteRating} />
                  {!m.handled && (
                    <Badge className="bg-amber-50 text-amber-700 ring-amber-600/20">New</Badge>
                  )}
                  {m.handled && (
                    <Badge className="bg-brand-50 text-brand-700 ring-brand-600/20">Handled</Badge>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  {m.name && <span className="font-medium text-ink">{m.name}</span>}
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-navy-800">
                      <Mail className="size-3.5" aria-hidden /> {m.email}
                    </a>
                  )}
                  <span>{new Date(m.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => toggleHandled(m)}
                disabled={savingId === m.id}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-medium text-navy-800 ring-1 ring-inset ring-line hover:bg-navy-50 disabled:opacity-60"
              >
                {savingId === m.id ? <Spinner className="size-4" /> : <Check className="size-4" aria-hidden />}
                {m.handled ? "Mark new" : "Mark handled"}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{m.message}</p>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
    </div>
  );
}
