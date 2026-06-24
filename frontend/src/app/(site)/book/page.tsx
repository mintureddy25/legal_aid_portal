"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CircleCheckBig } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { api, ApiError } from "@/lib/api";
import { Container, Button, Field, inputClass } from "@/components/ui";

interface Slot {
  id: string;
  startsAt: string;
  durationMin: number;
}

export default function BookPage() {
  const { t } = useI18n();
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Slot[]>("/appointments/slots").then(setSlots).catch(() => setSlots([]));
  }, []);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await api("/appointments/book", {
        method: "POST",
        body: { slotId: selected.id, ...form, email: form.email || undefined, reason: form.reason || undefined },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-surface p-8 text-center ring-1 ring-line">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
            <CircleCheckBig className="size-7" aria-hidden />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-navy-800">
            {t("book.booked")}
          </h1>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
          {t("book.title")}
        </h1>
        <p className="mt-2 text-muted">{t("book.subtitle")}</p>

        {slots && slots.length === 0 && (
          <div className="mt-8 rounded-2xl bg-surface p-10 text-center ring-1 ring-line">
            <CalendarClock className="mx-auto size-8 text-slate-300" aria-hidden />
            <p className="mt-3 text-muted">{t("book.none")}</p>
          </div>
        )}

        {slots && slots.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((s) => {
                const active = selected?.id === s.id;
                const d = new Date(s.startsAt);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelected(s)}
                    aria-pressed={active}
                    className={`flex flex-col items-start rounded-xl p-3 text-left ring-1 transition-colors min-h-16 ${
                      active ? "bg-brand-50 ring-2 ring-brand-500" : "bg-white ring-line hover:ring-brand-300"
                    }`}
                  >
                    <span className="text-sm font-medium text-ink">
                      {d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                    <span className="text-sm text-muted tabular">
                      {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {s.durationMin}m
                    </span>
                  </button>
                );
              })}
            </div>

            {selected && (
              <form onSubmit={book} className="mt-8 grid gap-4 rounded-2xl bg-surface p-6 ring-1 ring-line sm:grid-cols-2">
                <Field label={t("form.name")} required htmlFor="bname">
                  <input
                    id="bname"
                    className={inputClass}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Field>
                <Field label={t("form.phone")} required htmlFor="bphone">
                  <input
                    id="bphone"
                    type="tel"
                    inputMode="tel"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={t("form.email")} htmlFor="bemail">
                    <input
                      id="bemail"
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label={t("book.reason")} htmlFor="breason">
                    <input
                      id="breason"
                      className={inputClass}
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    />
                  </Field>
                </div>
                {error && (
                  <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <div className="sm:col-span-2">
                  <Button type="submit" loading={submitting} disabled={submitting} className="w-full sm:w-auto">
                    {t("book.confirm")}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
