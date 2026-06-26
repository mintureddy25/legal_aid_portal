"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { STATUSES, STATUS_STYLE, URGENCY_STYLE, type Status, type Urgency } from "@/lib/constants";
import { Badge, Button, LoadingState, Spinner } from "@/components/ui";
import { ChatBox } from "@/components/ChatBox";

interface Note {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}
interface CaseDetail {
  id: string;
  reference: string;
  name: string;
  age: number | null;
  phone: string;
  email: string | null;
  state: string | null;
  language: string;
  category: string;
  summary: string;
  description: string;
  urgency: Urgency;
  priorConsult: boolean;
  documents: string | null;
  status: Status;
  createdAt: string;
  notes: Note[];
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token } = useAdminAuth();
  const [c, setC] = useState<CaseDetail | null>(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [savingStatusTo, setSavingStatusTo] = useState<Status | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setC(await api<CaseDetail>(`/admin/cases/${id}`, { token }));
  }, [id, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(status: Status) {
    setSavingStatusTo(status);
    try {
      await api(`/admin/cases/${id}/status`, { method: "PATCH", body: { status }, token });
      await load();
    } finally {
      setSavingStatusTo(null);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSavingNote(true);
    await api(`/admin/cases/${id}/notes`, { method: "POST", body: { body: note.trim() }, token });
    setNote("");
    await load();
    setSavingNote(false);
  }

  if (!c) return <LoadingState label="Loading case…" />;

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-800">
        <ArrowLeft className="size-4" aria-hidden />
        All cases
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy-800 tabular">{c.reference}</h1>
        <Badge className={STATUS_STYLE[c.status]}>{c.status.replace("_", " ")}</Badge>
        <Badge className={URGENCY_STYLE[c.urgency]}>{c.urgency}</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: details + notes */}
        <div className="space-y-6">
          {/* Status control */}
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
            <h2 className="text-sm font-semibold text-ink">Update status</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={savingStatusTo !== null || c.status === s}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium ring-1 transition-colors disabled:opacity-60 ${
                    c.status === s
                      ? "bg-navy-800 text-white ring-navy-800"
                      : "bg-white text-ink ring-line hover:ring-navy-400"
                  }`}
                >
                  {savingStatusTo === s && <Spinner className="size-4" />}
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Contact + case */}
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-ink">{c.name}{c.age ? `, ${c.age}` : ""}</span>
              <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 text-navy-600 hover:underline">
                <Phone className="size-4" aria-hidden />{c.phone}
              </a>
              {c.email && (
                <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-navy-600 hover:underline">
                  <Mail className="size-4" aria-hidden />{c.email}
                </a>
              )}
              {c.state && (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <MapPin className="size-4" aria-hidden />{c.state}
                </span>
              )}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Detail label="Category" value={c.category} />
              <Detail label="Language" value={c.language} />
              <Detail label="Prior lawyer" value={c.priorConsult ? "Yes" : "No"} />
              <Detail label="Documents" value={c.documents || "—"} />
            </dl>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-muted">Summary</div>
              <p className="mt-1 font-medium text-ink">{c.summary}</p>
            </div>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-muted">Description</div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">{c.description}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
            <h2 className="text-sm font-semibold text-ink">Internal notes</h2>
            <form onSubmit={addNote} className="mt-3 flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a private note…"
                className="min-h-10 flex-1 rounded-lg bg-white px-3 text-sm ring-1 ring-inset ring-line outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Add internal note"
              />
              <Button type="submit" loading={savingNote} disabled={savingNote || !note.trim()}>
                Add
              </Button>
            </form>
            <ul className="mt-4 space-y-3">
              {c.notes.length === 0 && <li className="text-sm text-muted">No notes yet.</li>}
              {c.notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-canvas p-3 text-sm ring-1 ring-line">
                  <p className="text-ink">{n.body}</p>
                  <p className="mt-1 text-xs text-muted">
                    {n.author} · {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: live chat with the client */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-2 text-sm font-semibold text-ink">Live chat with client</h2>
          <ChatBox
            token={token ?? undefined}
            caseId={c.id}
            me="LAWYER"
            closed={c.status === "CLOSED"}
            className="h-[60vh] min-h-[420px]"
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
