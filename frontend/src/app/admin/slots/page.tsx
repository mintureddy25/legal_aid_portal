"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, CalendarClock } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { Badge, Button, Field, inputClass } from "@/components/ui";

interface Slot {
  id: string;
  startsAt: string;
  durationMin: number;
  isBooked: boolean;
  appointment: { name: string; phone: string } | null;
}

export default function AdminSlots() {
  const { token } = useAdminAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [datetime, setDatetime] = useState("");
  const [duration, setDuration] = useState(15);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (token) setSlots(await api<Slot[]>("/appointments/admin/slots", { token }));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!datetime) return;
    setSaving(true);
    await api("/appointments/admin/slots", {
      method: "POST",
      body: { starts: [new Date(datetime).toISOString()], durationMin: duration },
      token,
    });
    setDatetime("");
    await load();
    setSaving(false);
  }

  async function remove(id: string) {
    await api(`/appointments/admin/slots/${id}`, { method: "DELETE", token });
    await load();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-navy-800">Consultation slots</h1>
      <p className="mt-1 text-sm text-muted">Open 15-minute slots for free consultations. Clients can book any open slot.</p>

      <form onSubmit={add} className="mt-6 grid gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <Field label="Date & time" htmlFor="dt">
          <input
            id="dt"
            type="datetime-local"
            className={inputClass}
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </Field>
        <Field label="Minutes" htmlFor="dur">
          <input
            id="dur"
            type="number"
            min={5}
            max={120}
            className={`${inputClass} w-24`}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </Field>
        <Button type="submit" loading={saving} disabled={saving || !datetime}>
          <Plus className="size-4" aria-hidden />
          Add slot
        </Button>
      </form>

      <div className="mt-6 grid gap-2">
        {slots.length === 0 && (
          <p className="rounded-2xl bg-surface p-10 text-center text-sm text-muted ring-1 ring-line">
            <CalendarClock className="mx-auto mb-2 size-7 text-slate-300" aria-hidden />
            No slots yet.
          </p>
        )}
        {slots.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl bg-surface p-4 ring-1 ring-line">
            <div>
              <div className="font-medium text-ink tabular">
                {new Date(s.startsAt).toLocaleString([], {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                · {s.durationMin}m
              </div>
              {s.appointment && (
                <div className="mt-0.5 text-xs text-muted">
                  Booked by {s.appointment.name} · {s.appointment.phone}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {s.isBooked ? (
                <Badge className="bg-brand-50 text-brand-700 ring-brand-600/20">Booked</Badge>
              ) : (
                <>
                  <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">Open</Badge>
                  <button
                    onClick={() => remove(s.id)}
                    className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete slot"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
