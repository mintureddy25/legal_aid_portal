"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Phone, Mail, CalendarCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { Badge, LoadingState, Pagination, Spinner } from "@/components/ui";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  reason: string | null;
  caseRef: string | null;
  status: string;
  createdAt: string;
  slot: { startsAt: string; durationMin: number };
}

// The three meaningful outcomes the owner sets, plus the default "Upcoming".
const STATUS: Record<string, { label: string; cls: string }> = {
  BOOKED: { label: "Upcoming", cls: "bg-navy-50 text-navy-600 ring-navy-600/20" },
  ATTENDED: { label: "Attended", cls: "bg-brand-50 text-brand-700 ring-brand-600/20" },
  NO_SHOW: { label: "Not attended", cls: "bg-red-50 text-red-700 ring-red-600/20" },
  TIMED_OUT: { label: "Timed out", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" },
};
const ACTIONS: { value: string; label: string }[] = [
  { value: "ATTENDED", label: "Attended" },
  { value: "NO_SHOW", label: "Not attended" },
  { value: "TIMED_OUT", label: "Timed out" },
  { value: "BOOKED", label: "Upcoming" },
];
const FILTERS = ["all", "BOOKED", "ATTENDED", "NO_SHOW", "TIMED_OUT"] as const;
const PER_PAGE = 10;

const istDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
const istDateKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

function statusOf(s: string) {
  return STATUS[s] ?? { label: s, cls: "bg-slate-100 text-slate-600 ring-slate-500/20" };
}

export default function AdminEvents() {
  const { token } = useAdminAuth();
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (token) setRows(await api<Booking[]>("/appointments/admin/bookings", { token }));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Filters change the result set, so jump back to the first page.
  const onSearch = (v: string) => { setQ(v); setPage(1); };
  const onStatus = (v: (typeof FILTERS)[number]) => { setStatus(v); setPage(1); };
  const onDate = (v: string) => { setDate(v); setPage(1); };
  const clearFilters = () => { setQ(""); setDate(""); setStatus("all"); setPage(1); };

  async function setBookingStatus(id: string, value: string) {
    setSavingId(id);
    try {
      await api(`/appointments/admin/bookings/${id}/status`, {
        method: "PATCH",
        body: { status: value },
        token,
      });
      await load();
    } finally {
      setSavingId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!rows) return [];
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (date && istDateKey(r.slot.startsAt) !== date) return false;
      if (ql && !`${r.name} ${r.phone} ${r.email ?? ""}`.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [rows, q, status, date]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const pageRows = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-800">Events</h1>
      <p className="mt-1 text-sm text-muted">Booked consultation calls. Times shown in IST.</p>

      {/* Filters */}
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            placeholder="Search name, phone, email…"
            className="min-h-10 w-full rounded-lg bg-white pl-9 pr-3 text-sm ring-1 ring-inset ring-line outline-none focus:ring-2 focus:ring-brand-500"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search events"
          />
        </div>
        <select
          className="min-h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-inset ring-line"
          value={status}
          onChange={(e) => onStatus(e.target.value as (typeof FILTERS)[number])}
          aria-label="Filter by status"
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f === "all" ? "All statuses" : statusOf(f).label}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="min-h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-inset ring-line"
          value={date}
          onChange={(e) => onDate(e.target.value)}
          aria-label="Filter by date"
        />
        {(q || date || status !== "all") && (
          <button
            onClick={clearFilters}
            className="min-h-10 rounded-lg bg-white px-3 text-sm font-medium text-navy-800 ring-1 ring-inset ring-line hover:bg-navy-50"
          >
            Clear filters
          </button>
        )}
      </div>

      {rows === null && <LoadingState label="Loading events…" />}

      {rows && filtered.length === 0 && (
        <p className="mt-6 rounded-2xl bg-surface p-10 text-center text-sm text-muted ring-1 ring-line">
          <CalendarCheck className="mx-auto mb-2 size-7 text-slate-300" aria-hidden />
          No call events match these filters.
        </p>
      )}

      <div className="mt-6 grid gap-3">
        {pageRows.map((r) => {
          const st = statusOf(r.status);
          return (
            <div key={r.id} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">{r.name}</span>
                    <Badge className={st.cls}>{st.label}</Badge>
                    {r.caseRef && <span className="text-xs text-muted tabular">Ref {r.caseRef}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:text-navy-800">
                      <Phone className="size-3.5" aria-hidden /> {r.phone}
                    </a>
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-navy-800">
                        <Mail className="size-3.5" aria-hidden /> {r.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium text-ink tabular">{istDateTime(r.slot.startsAt)}</div>
                  <div className="text-xs text-muted">{r.slot.durationMin} min · IST</div>
                </div>
              </div>

              {r.reason && <p className="mt-3 text-sm text-ink">{r.reason}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {savingId === r.id ? (
                  <span className="inline-flex items-center gap-2 text-sm text-muted">
                    <Spinner className="size-4" /> Saving…
                  </span>
                ) : (
                  ACTIONS.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setBookingStatus(r.id, a.value)}
                      disabled={r.status === a.value}
                      className={`min-h-9 rounded-lg px-3 text-xs font-medium ring-1 ring-inset transition-colors ${
                        r.status === a.value
                          ? "bg-navy-800 text-white ring-navy-800"
                          : "bg-white text-ink ring-line hover:ring-navy-400"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
    </div>
  );
}
