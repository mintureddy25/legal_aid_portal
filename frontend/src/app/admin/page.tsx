"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, MessageSquare } from "lucide-react";
import { api, API_URL } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import {
  CATEGORIES,
  STATUSES,
  URGENCIES,
  STATUS_STYLE,
  URGENCY_STYLE,
  type Status,
  type Urgency,
} from "@/lib/constants";
import { Badge, LoadingState, Pagination } from "@/components/ui";

const CASES_PER_PAGE = 10;

interface CaseRow {
  id: string;
  reference: string;
  name: string;
  phone: string;
  category: string;
  urgency: Urgency;
  state: string | null;
  status: Status;
  createdAt: string;
  _count: { messages: number };
}
interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  responded: number;
  closed: number;
}

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ q: "", status: "", category: "", urgency: "" });

  const qs = useCallback(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.set(k, v));
    return p.toString();
  }, [filters]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const [s, c] = await Promise.all([
      api<Stats>("/admin/stats", { token }),
      api<CaseRow[]>(`/admin/cases?${qs()}`, { token }),
    ]);
    setStats(s);
    setRows(c);
    setLoading(false);
  }, [token, qs]);

  useEffect(() => {
    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
  }, [load]);

  // Filters change the result set, so jump back to the first page.
  function setFilter(patch: Partial<typeof filters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }

  const totalPages = Math.ceil(rows.length / CASES_PER_PAGE) || 1;
  const pageRows = useMemo(
    () => rows.slice((page - 1) * CASES_PER_PAGE, page * CASES_PER_PAGE),
    [rows, page],
  );

  async function exportCsv() {
    const res = await fetch(`${API_URL}/admin/cases/export?${qs()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-aid-cases.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy-800">Cases</h1>
        <button
          onClick={exportCsv}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-navy-800 ring-1 ring-inset ring-line hover:bg-navy-50"
        >
          <Download className="size-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats &&
          (
            [
              ["Total", stats.total, "text-navy-800"],
              ["Pending", stats.pending, "text-amber-600"],
              ["In progress", stats.inProgress, "text-navy-600"],
              ["Responded", stats.responded, "text-brand-600"],
              ["Closed", stats.closed, "text-slate-500"],
            ] as const
          ).map(([label, val, color]) => (
            <div key={label} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
              <div className={`font-display text-2xl font-semibold tabular ${color}`}>{val}</div>
              <div className="mt-0.5 text-xs text-muted">{label}</div>
            </div>
          ))}
      </div>

      {/* Filters */}
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            placeholder="Search name, phone, reference…"
            className="min-h-10 w-full rounded-lg bg-white pl-9 pr-3 text-sm ring-1 ring-inset ring-line outline-none focus:ring-2 focus:ring-brand-500"
            value={filters.q}
            onChange={(e) => setFilter({ q: e.target.value })}
            aria-label="Search cases"
          />
        </div>
        <select
          className="min-h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-inset ring-line"
          value={filters.status}
          onChange={(e) => setFilter({ status: e.target.value })}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select
          className="min-h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-inset ring-line"
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.key}</option>
          ))}
        </select>
        <select
          className="min-h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-inset ring-line"
          value={filters.urgency}
          onChange={(e) => setFilter({ urgency: e.target.value })}
          aria-label="Filter by urgency"
        >
          <option value="">All urgency</option>
          {URGENCIES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {loading && <LoadingState label="Loading cases…" />}

      {!loading && (
      <>
      {/* Table (desktop) */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl bg-surface ring-1 ring-line md:block">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs uppercase tracking-wide text-navy-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pageRows.map((r) => (
              <tr key={r.id} className="hover:bg-canvas">
                <td className="px-4 py-3">
                  <Link href={`/admin/cases/${r.id}`} className="font-medium text-navy-800 tabular hover:text-brand-600">
                    {r.reference}
                  </Link>
                </td>
                <td className="px-4 py-3">{r.name}<div className="text-xs text-muted">{r.phone}</div></td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3"><Badge className={URGENCY_STYLE[r.urgency]}>{r.urgency}</Badge></td>
                <td className="px-4 py-3"><Badge className={STATUS_STYLE[r.status]}>{r.status.replace("_", " ")}</Badge></td>
                <td className="px-4 py-3 text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  {r._count.messages > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-brand-600">
                      <MessageSquare className="size-3.5" aria-hidden />
                      {r._count.messages}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">No cases match these filters.</p>
        )}
      </div>

      {/* Cards (mobile) */}
      <div className="mt-4 grid gap-3 md:hidden">
        {pageRows.map((r) => (
          <Link
            key={r.id}
            href={`/admin/cases/${r.id}`}
            className="rounded-2xl bg-surface p-4 ring-1 ring-line"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-navy-800 tabular">{r.reference}</span>
              <Badge className={STATUS_STYLE[r.status]}>{r.status.replace("_", " ")}</Badge>
            </div>
            <div className="mt-1 text-sm text-ink">{r.name} · {r.phone}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Badge className={URGENCY_STYLE[r.urgency]}>{r.urgency}</Badge>
              {r.category} · {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
        {rows.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No cases match these filters.</p>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
      </>
      )}
    </div>
  );
}
