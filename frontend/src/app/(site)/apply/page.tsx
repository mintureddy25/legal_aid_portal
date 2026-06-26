"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, CircleCheckBig } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, INDIAN_STATES, URGENCIES, type Urgency } from "@/lib/constants";
import { CatIcon } from "@/lib/catIcon";
import { api, ApiError } from "@/lib/api";
import { Container, Button, Field, inputClass } from "@/components/ui";

interface FormState {
  category: string;
  name: string;
  age: string;
  phone: string;
  email: string;
  state: string;
  language: string;
  summary: string;
  description: string;
  urgency: Urgency;
  priorConsult: boolean;
  documents: string;
}

const empty: FormState = {
  category: "",
  name: "",
  age: "",
  phone: "",
  email: "",
  state: "",
  language: "English",
  summary: "",
  description: "",
  urgency: "MEDIUM",
  priorConsult: false,
  documents: "",
};

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyForm />
    </Suspense>
  );
}

function ApplyForm() {
  const { t } = useI18n();
  const params = useSearchParams();
  const [form, setForm] = useState<FormState>({
    ...empty,
    category: params.get("category") ?? "",
  });
  const [step, setStep] = useState(form.category ? 2 : 1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const steps = [t("form.s1"), t("form.s2"), t("form.s3"), t("form.s4")];

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 1 && !form.category) e.category = "Please choose a category";
    if (s === 2) {
      if (form.name.trim().length < 2) e.name = "Enter your full name";
      if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
      if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
        e.email = "Enter a valid email";
      if (form.age && (Number(form.age) < 1 || Number(form.age) > 120))
        e.age = "Enter a valid age";
    }
    if (s === 3) {
      if (form.summary.trim().length < 3) e.summary = "Add a short summary";
      if (form.description.trim().length < 50)
        e.description = `At least 50 characters (${form.description.trim().length}/50)`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1));
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await api<{ reference: string }>("/cases", {
        method: "POST",
        body: {
          category: form.category,
          name: form.name.trim(),
          age: form.age ? Number(form.age) : undefined,
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          state: form.state || undefined,
          language: form.language,
          summary: form.summary.trim(),
          description: form.description.trim(),
          urgency: form.urgency,
          priorConsult: form.priorConsult,
          documents: form.documents.trim() || undefined,
        },
      });
      setReference(res.reference);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) return <SuccessScreen reference={reference} />;

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
          {t("form.title")}
        </h1>

        {/* Progress tracker */}
        <Stepper steps={steps} current={step} />

        <div className="mt-8 rounded-2xl bg-surface p-5 ring-1 ring-line sm:p-7">
          {step === 1 && (
            <fieldset>
              <legend className="text-base font-semibold text-ink">{t("cats.title")}</legend>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((c) => {
                  const active = form.category === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => set("category", c.key)}
                      aria-pressed={active}
                      className={`flex flex-col items-start gap-2 rounded-xl p-3 text-left ring-1 transition-all min-h-20 ${
                        active
                          ? "bg-brand-50 ring-2 ring-brand-500"
                          : "bg-white ring-line hover:ring-brand-300"
                      }`}
                    >
                      <CatIcon
                        name={c.icon}
                        className={`size-5 ${active ? "text-brand-600" : "text-navy-600"}`}
                      />
                      <span className="text-sm font-medium text-ink">{t(c.i18n)}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                  {errors.category}
                </p>
              )}
            </fieldset>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label={t("form.name")} required htmlFor="name" error={errors.name}>
                  <input
                    id="name"
                    className={inputClass}
                    value={form.name}
                    autoComplete="name"
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>
              </div>
              <Field label={t("form.age")} htmlFor="age" error={errors.age}>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  className={inputClass}
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                />
              </Field>
              <Field label={t("form.phone")} required htmlFor="phone" error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </Field>
              <Field label={t("form.email")} htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label={t("form.state")} htmlFor="state">
                <select
                  id="state"
                  className={inputClass}
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                >
                  <option value="">—</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label={t("form.language")} htmlFor="language">
                  <select
                    id="language"
                    className={inputClass}
                    value={form.language}
                    onChange={(e) => set("language", e.target.value)}
                  >
                    <option>English</option>
                    <option>Telugu</option>
                    <option>Hindi</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              <Field label={t("form.summary")} required htmlFor="summary" error={errors.summary}>
                <input
                  id="summary"
                  className={inputClass}
                  maxLength={140}
                  value={form.summary}
                  onChange={(e) => set("summary", e.target.value)}
                />
              </Field>
              <Field
                label={t("form.description")}
                required
                htmlFor="description"
                hint={t("form.descHint")}
                error={errors.description}
              >
                <textarea
                  id="description"
                  rows={6}
                  className={`${inputClass} min-h-32 py-2.5 leading-relaxed`}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
              <fieldset>
                <legend className="text-sm font-medium text-ink">{t("form.urgency")}</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {URGENCIES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => set("urgency", u)}
                      aria-pressed={form.urgency === u}
                      className={`min-h-11 rounded-lg px-3 text-sm font-medium ring-1 transition-colors ${
                        form.urgency === u
                          ? "bg-navy-800 text-white ring-navy-800"
                          : "bg-white text-ink ring-line hover:ring-navy-400"
                      }`}
                    >
                      {t(`urgency.${u}`)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-medium text-ink">{t("form.prior")}</legend>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => set("priorConsult", v)}
                      aria-pressed={form.priorConsult === v}
                      className={`min-h-11 rounded-lg px-5 text-sm font-medium ring-1 transition-colors ${
                        form.priorConsult === v
                          ? "bg-brand-500 text-white ring-brand-500"
                          : "bg-white text-ink ring-line hover:ring-brand-300"
                      }`}
                    >
                      {v ? t("form.yes") : t("form.no")}
                    </button>
                  ))}
                </div>
              </fieldset>
              <Field label={t("form.documents")} htmlFor="documents">
                <input
                  id="documents"
                  className={inputClass}
                  placeholder="e.g. FIR copy, rent agreement, bank statements"
                  value={form.documents}
                  onChange={(e) => set("documents", e.target.value)}
                />
              </Field>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-base font-semibold text-ink">{t("form.s4")}</h2>
              <dl className="mt-4 divide-y divide-line rounded-xl ring-1 ring-line">
                <Review label={t("cats.title")} value={form.category} />
                <Review label={t("form.name")} value={form.name} />
                <Review label={t("form.phone")} value={form.phone} />
                <Review label={t("form.email")} value={form.email || "—"} />
                <Review label={t("form.state")} value={form.state || "—"} />
                <Review label={t("form.summary")} value={form.summary} />
                <Review label={t("form.urgency")} value={t(`urgency.${form.urgency}`)} />
                <Review label={t("form.description")} value={form.description} />
              </dl>
              {serverError && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {serverError}
                </p>
              )}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button variant="ghost" type="button" onClick={back}>
                <ChevronLeft className="size-4" aria-hidden />
                {t("form.back")}
              </Button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <Button type="button" onClick={next}>
                {t("form.next")}
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button type="button" onClick={submit} loading={submitting} disabled={submitting}>
                {t("form.submit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mt-6 flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors ${
                  done
                    ? "bg-brand-500 text-white"
                    : active
                      ? "bg-navy-800 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-4" aria-hidden /> : n}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  active ? "text-navy-800" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {n < steps.length && (
              <span className={`h-px flex-1 ${done ? "bg-brand-500" : "bg-line"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:gap-4">
      <dt className="w-44 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-sm text-ink break-words">{value}</dd>
    </div>
  );
}

function SuccessScreen({ reference }: { reference: string }) {
  const { t } = useI18n();
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg rounded-2xl bg-surface p-8 text-center ring-1 ring-line">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <CircleCheckBig className="size-7" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-navy-800">
          {t("form.done.title")}
        </h1>
        <p className="mt-2 text-sm text-muted">{t("form.done.body")}</p>
        <div className="mt-5 rounded-xl bg-navy-800 px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-navy-200">Reference</div>
          <div className="mt-1 font-display text-3xl font-semibold tracking-wide text-white tabular">
            {reference}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/track?ref=${reference}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-navy-800 px-5 text-sm font-medium text-white hover:bg-navy-600"
          >
            {t("form.done.track")}
          </Link>
          <Link
            href={`/chat/${reference}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
          >
            {t("form.done.chat")}
          </Link>
        </div>
      </div>
    </Container>
  );
}
