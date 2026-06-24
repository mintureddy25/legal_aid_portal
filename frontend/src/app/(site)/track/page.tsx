"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MessagesSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { api, ApiError } from "@/lib/api";
import { STATUSES, STATUS_STYLE, type Status } from "@/lib/constants";
import { Container, Button, Badge } from "@/components/ui";

interface TrackResult {
  reference: string;
  name: string;
  category: string;
  status: Status;
  urgency: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <Track />
    </Suspense>
  );
}

function Track() {
  const { t } = useI18n();
  const params = useSearchParams();
  const [ref, setRef] = useState(params.get("ref")?.toUpperCase() ?? "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(reference: string) {
    if (!reference.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api<TrackResult>(`/track/${encodeURIComponent(reference.trim())}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 404 ? t("track.notfound") : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = params.get("ref");
    if (initial) lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
          {t("track.title")}
        </h1>
        <p className="mt-2 text-muted">{t("track.subtitle")}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(ref);
          }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="ref" className="sr-only">
            {t("track.placeholder")}
          </label>
          <input
            id="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder={t("track.placeholder")}
            className="min-h-12 flex-1 rounded-lg bg-white px-4 font-display text-lg font-semibold tracking-wide tabular ring-1 ring-inset ring-line outline-none focus:ring-2 focus:ring-brand-500"
            autoCapitalize="characters"
          />
          <Button type="submit" loading={loading} className="min-h-12">
            <Search className="size-4" aria-hidden />
            {t("track.button")}
          </Button>
        </form>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-6 animate-fade-up rounded-2xl bg-surface p-6 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-navy-800 tabular">
                {result.reference}
              </span>
              <Badge className={STATUS_STYLE[result.status]}>{t(`status.${result.status}`)}</Badge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">{result.name}</dt>
                <dd className="font-medium text-ink">{result.category}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("track.submitted")}</dt>
                <dd className="font-medium text-ink">
                  {new Date(result.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>

            {/* status timeline */}
            <ol className="mt-6 flex items-center gap-1">
              {STATUSES.map((s, i) => {
                const reachedIndex = STATUSES.indexOf(result.status);
                const reached = i <= reachedIndex;
                return (
                  <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full items-center">
                      <span
                        className={`size-2.5 shrink-0 rounded-full ${reached ? "bg-brand-500" : "bg-slate-300"}`}
                      />
                      {i < STATUSES.length - 1 && (
                        <span className={`h-0.5 flex-1 ${i < reachedIndex ? "bg-brand-500" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs ${reached ? "text-navy-800" : "text-slate-400"}`}>
                      {t(`status.${s}`)}
                    </span>
                  </li>
                );
              })}
            </ol>

            <Link
              href={`/chat/${result.reference}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
            >
              <MessagesSquare className="size-4" aria-hidden />
              {t("track.openChat")}
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
