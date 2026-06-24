"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, BadgeIndianRupee, MessagesSquare, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/constants";
import { CatIcon } from "@/lib/catIcon";
import { Container, LinkButton } from "@/components/ui";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-800 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-sm font-medium text-brand-300 ring-1 ring-inset ring-brand-500/30">
              <Sparkles className="size-3.5" aria-hidden />
              {t("hero.badge")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/apply" variant="primary" className="text-base">
                {t("hero.cta")}
                <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
              <LinkButton
                href="/track"
                variant="ghost"
                className="border-white/20 text-white ring-white/20 hover:bg-white/10"
              >
                {t("hero.secondary")}
              </LinkButton>
            </div>
          </div>

          {/* Trust stats */}
          <dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Stat icon={<ShieldCheck className="size-5" />} value="100+" label={t("stats.cases")} />
            <Stat icon={<Clock className="size-5" />} value={t("stats.hours")} label={t("stats.response")} />
            <Stat icon={<MessagesSquare className="size-5" />} value={t("stats.chatValue")} label={t("stats.chat")} />
            <Stat icon={<BadgeIndianRupee className="size-5" />} value={t("stats.zero")} label={t("stats.free")} />
          </dl>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
              {t("cats.title")}
            </h2>
            <p className="mt-2 text-muted">{t("cats.subtitle")}</p>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link
                  href={`/apply?category=${encodeURIComponent(c.key)}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line transition-all duration-200 hover:-translate-y-0.5 hover:ring-brand-300 hover:shadow-md sm:p-5"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <CatIcon name={c.icon} className="size-5" />
                  </span>
                  <span className="font-medium text-ink">{t(c.i18n)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 sm:py-20 ring-1 ring-line">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
            {t("how.title")}
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="relative rounded-2xl bg-canvas p-6 ring-1 ring-line">
                <span className="grid size-9 place-items-center rounded-full bg-navy-800 font-display text-sm font-semibold text-white tabular">
                  {n}
                </span>
                <h3 className="mt-4 font-semibold text-ink">{t(`how.step${n}.t`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(`how.step${n}.d`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t("cta.title")}</h2>
            <p className="mx-auto mt-3 max-w-md text-navy-100">{t("cta.body")}</p>
            <div className="mt-8 flex justify-center">
              <LinkButton href="/apply" variant="primary" className="text-base">
                {t("cta.button")}
                <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/10 backdrop-blur">
      <div className="flex items-center gap-2 text-brand-300">{icon}</div>
      <dd className="mt-2 font-display text-3xl font-semibold tabular">{value}</dd>
      <dt className="mt-0.5 text-sm text-navy-100">{label}</dt>
    </div>
  );
}
