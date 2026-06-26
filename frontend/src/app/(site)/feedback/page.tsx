"use client";

import { useState } from "react";
import { CircleCheckBig, Heart, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { api, ApiError } from "@/lib/api";
import { Container, Button, Field, inputClass } from "@/components/ui";

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">
        {label}
        <span className="text-red-600" aria-hidden> *</span>
      </legend>
      <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = (hover || value) >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={value === n}
              className="p-1 [touch-action:manipulation]"
            >
              <Star
                className={`size-8 transition-colors ${
                  active ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function FeedbackPage() {
  const { t } = useI18n();
  const [serviceRating, setServiceRating] = useState(0);
  const [websiteRating, setWebsiteRating] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (serviceRating < 1 || websiteRating < 1) {
      setError(t("feedback.ratingRequired"));
      return;
    }
    if (message.trim().length < 5) {
      setError(t("feedback.messageHint"));
      return;
    }
    setSubmitting(true);
    try {
      await api("/feedback", {
        method: "POST",
        body: {
          serviceRating,
          websiteRating,
          message: message.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("feedback.error"));
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
            {t("feedback.thanks.title")}
          </h1>
          <p className="mt-2 text-muted">{t("feedback.thanks.body")}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
          {t("feedback.title")}
        </h1>

        {/* Warm welcome message */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-600/15">
          <Heart className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
          <p className="text-sm leading-relaxed text-navy-800">{t("feedback.welcome")}</p>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-6 rounded-2xl bg-surface p-6 ring-1 ring-line">
          {/* Separate ratings for service and website */}
          <div className="grid gap-6 sm:grid-cols-2">
            <StarRating
              label={t("feedback.rateService")}
              value={serviceRating}
              onChange={setServiceRating}
            />
            <StarRating
              label={t("feedback.rateWebsite")}
              value={websiteRating}
              onChange={setWebsiteRating}
            />
          </div>

          {/* Message */}
          <Field label={t("feedback.message")} hint={t("feedback.messageHint")} required htmlFor="fb-message">
            <textarea
              id="fb-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={4000}
              className={`${inputClass} min-h-28 resize-y py-2.5`}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("feedback.name")} htmlFor="fb-name">
              <input
                id="fb-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className={inputClass}
              />
            </Field>
            <Field label={t("feedback.email")} htmlFor="fb-email">
              <input
                id="fb-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={160}
                className={inputClass}
              />
            </Field>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" loading={submitting} className="min-h-12 w-full">
            {t("feedback.submit")}
          </Button>
        </form>
      </div>
    </Container>
  );
}
