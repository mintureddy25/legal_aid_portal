"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Scale,
  Home,
  Target,
  Shield,
  Gavel,
  Plus,
  Minus,
  Phone,
  Mail,
  MapPin,
  Quote,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TextGenerate } from "@/components/TextGenerate";
import { useI18n } from "@/lib/i18n";
import {
  STATS,
  WHAT_WE_DO,
  SERVICES,
  EXPERTS,
  TESTIMONIALS,
  PARTNERS,
  FAQS,
  CONTACT,
  tx,
} from "@/lib/home-data";

const ICONS: Record<string, typeof Scale> = { scale: Scale, home: Home, target: Target, shield: Shield };

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        dark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-neutral-900 text-white"
      }`}
    >
      {children}
    </span>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.94H5.56v8.4h2.78zM6.95 8.7a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22zm11.39 9.64v-4.6c0-2.46-1.31-3.6-3.06-3.6-1.41 0-2.04.78-2.4 1.33v-1.14h-2.77c.04.78 0 8.4 0 8.4h2.77v-4.69c0-.25.02-.5.09-.68.2-.5.66-1.01 1.42-1.01.99 0 1.39.75 1.39 1.86v4.52h2.57z" />
    </svg>
  );
}

// Warm off-white used by the template for alternating sections
const OFFWHITE = "#f3f2ef";

export default function HomePage() {
  return (
    <div className="font-grotesk overflow-x-clip bg-white">
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <Resources />
      <Partners />
      <Everything />
      <Team />
      <Testimonials />
      <Faq />
      <Contact />
      <CtaCard />
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: OFFWHITE }}>
      <FlowLines />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              {t("home.hero.eyebrow")}
            </span>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="mx-auto mt-5 max-w-4xl text-[2.6rem] font-medium leading-[1.02] tracking-[-0.03em] text-neutral-900 sm:text-6xl lg:text-[5.2rem]">
              {t("home.hero.title")}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {t("home.hero.subtitle")}
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 sm:w-auto"
              >
                {t("home.hero.cta1")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="/track"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-neutral-900 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50 sm:w-auto"
              >
                {t("home.hero.cta2")}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Two law images, like the template */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <Reveal variant="left">
            <HeroImage src="/hero/justice.jpg" alt="Statue of Lady Justice holding the scales" />
          </Reveal>
          <Reveal variant="right" delay={90}>
            <HeroImage src="/hero/scales.jpg" alt="Scales of justice beside a judge's gavel" />
          </Reveal>
        </div>

        <div className="mt-10 flex justify-center">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400">
            <ArrowDown className="size-4 animate-bounce" aria-hidden /> {t("home.hero.scroll")}
          </span>
        </div>
      </div>
    </section>
  );
}

function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-60 overflow-hidden rounded-3xl ring-1 ring-black/5 sm:h-80">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

/** Subtle vertical streak texture for the dark sections (like the reference). */
function DarkTexture() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)",
        maskImage: "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 70%)",
      }}
      aria-hidden
    />
  );
}

/** Faint flowing contour lines in the hero background, like the reference. */
function FlowLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1440 600"
      aria-hidden
    >
      <g fill="none" stroke="#000" strokeOpacity="0.05" strokeWidth="1">
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 40 + i * 30;
          return (
            <path
              key={i}
              d={`M-50 ${y} C 360 ${y - 46}, 720 ${y + 46}, 1080 ${y - 30} S 1490 ${y + 24}, 1490 ${y}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ───────────────────────── Who we are ───────────────────────── */
function WhoWeAre() {
  const { t, lang } = useI18n();
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <DarkTexture />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow dark>{t("home.who.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="mt-6 text-3xl font-medium tracking-tight sm:text-4xl">{t("home.who.title")}</h2>
          </Reveal>
          <TextGenerate
            key={lang}
            as="p"
            className="mt-5 text-neutral-400 leading-relaxed"
            text={t("home.who.body")}
          />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
                <div className="text-4xl font-medium tracking-tight tabular">{s.value}</div>
                <div className="mt-2 text-sm uppercase tracking-wider text-neutral-400">
                  {tx(lang, s.label, s.labelTe)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── What we do ───────────────────────── */
function WhatWeDo() {
  const { t, lang } = useI18n();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left" className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>{t("home.what.eyebrow")}</Eyebrow>
            <h2 className="mt-6 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              {t("home.what.title")}
            </h2>
            <TextGenerate
              key={lang}
              as="p"
              className="mt-5 max-w-md text-neutral-600 leading-relaxed"
              text={t("home.what.body")}
            />
            <Link
              href="/apply"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              {t("home.what.cta")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {WHAT_WE_DO.map((f, i) => {
              const Icon = ICONS[f.icon] ?? Scale;
              return (
                <Reveal key={f.title} delay={i * 90}>
                  <div className="group h-full rounded-2xl bg-white p-6 ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.25)]">
                    <span className="grid size-12 place-items-center rounded-xl bg-neutral-900 text-white transition-colors group-hover:bg-neutral-700">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-medium tracking-tight text-neutral-900">{tx(lang, f.title, f.titleTe)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{tx(lang, f.body, f.bodyTe)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Resources ───────────────────────── */
interface ResourceMeta {
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
}

function Resources() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<ResourceMeta[] | null>(null);

  useEffect(() => {
    api<ResourceMeta[]>("/blog")
      .then((d) => setPosts(d.slice(0, 6)))
      .catch(() => setPosts([]));
  }, []);

  return (
    <section style={{ backgroundColor: OFFWHITE }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{t("home.res.eyebrow")}</Eyebrow>
            <h2 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
              {t("home.res.title")}
            </h2>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            {t("home.res.viewall")} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Reveal>

        {posts === null ? (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-neutral-200/70" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {(posts.length ? posts.slice(0, 3) : FALLBACK_RESOURCES).map((c, i) => (
              <Reveal key={c.slug} delay={i * 110}>
                <ResourceCard r={c} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ResourceCard({ r }: { r: ResourceMeta }) {
  const { t } = useI18n();
  return (
    <Link
      href={`/resources/${r.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.25)]"
    >
      <div className="relative h-44 overflow-hidden bg-neutral-200">
        {r.coverImage ? (
          <Image
            src={r.coverImage}
            alt={r.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-950">
            <Building2 className="size-12 text-white/30" aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {r.category && (
          <span className="mb-3 self-start rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
            {r.category}
          </span>
        )}
        <h3 className="text-lg font-medium tracking-tight text-neutral-900 group-hover:text-neutral-600">
          {r.title}
        </h3>
        {r.excerpt && <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.excerpt}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-900">
          {t("home.res.read")} <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

// Shown only if the API returns nothing.
const FALLBACK_RESOURCES: ResourceMeta[] = [
  { slug: "coming-soon", title: "Know your rights", category: "Guides", excerpt: "Resources are on the way.", coverImage: "/resources/r3.jpg" },
  { slug: "coming-soon", title: "Free legal aid in India", category: "Guides", excerpt: "Resources are on the way.", coverImage: "/resources/r1.jpg" },
  { slug: "coming-soon", title: "Filing an FIR", category: "Guides", excerpt: "Resources are on the way.", coverImage: "/resources/r4.jpg" },
];

/* ───────────────────────── Partners / trusted ───────────────────────── */
function Partners() {
  const { t } = useI18n();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
            {t("home.partners.title")}
          </h2>
          <p className="mt-4 text-neutral-600">{t("home.partners.body")}</p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee gap-4">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div
                  key={`${p}-${i}`}
                  className="flex h-16 min-w-44 items-center justify-center rounded-xl bg-[#f3f2ef] px-6 text-sm font-medium tracking-tight text-neutral-500 ring-1 ring-neutral-200"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Everything you need ───────────────────────── */
function Everything() {
  const { t, lang } = useI18n();
  return (
    <section style={{ backgroundColor: OFFWHITE }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left" className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>{t("home.services.eyebrow")}</Eyebrow>
            <h2 className="mt-6 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              {t("home.services.title")}
            </h2>
            <TextGenerate
              key={lang}
              as="p"
              className="mt-5 max-w-md text-neutral-600 leading-relaxed"
              text={t("home.services.body")}
            />
          </Reveal>

          <div className="space-y-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} variant="right">
                <div className="flex items-start gap-4 rounded-2xl bg-neutral-950 p-6 text-white transition-transform duration-300 hover:translate-x-1">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Building2 className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{tx(lang, s.title, s.titleTe)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{tx(lang, s.body, s.bodyTe)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Meet our expert team ───────────────────────── */
function Team() {
  const { t, lang } = useI18n();
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <DarkTexture />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow dark>{t("home.team.eyebrow")}</Eyebrow>
          <h2 className="mt-6 text-3xl font-medium tracking-tight sm:text-4xl">{t("home.team.title")}</h2>
          <p className="mt-5 text-neutral-400 leading-relaxed">{t("home.team.body")}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTS.map((e, i) => (
            <Reveal key={e.name} delay={i * 120} variant="up-lg">
              <article className="group overflow-hidden rounded-3xl bg-neutral-900 ring-1 ring-white/10">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={e.img}
                    alt={e.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950 to-transparent" aria-hidden />
                  {e.linkedin && (
                    <a
                      href={e.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur ring-1 ring-white/20 transition-colors hover:bg-white hover:text-neutral-900"
                      aria-label={`${e.name} on LinkedIn`}
                    >
                      <LinkedInIcon className="size-4" />
                    </a>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{tx(lang, e.role, e.roleTe)}</div>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">{e.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-400">{tx(lang, e.bio, e.bioTe)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */
function Testimonials() {
  const { t, lang } = useI18n();
  const [idx, setIdx] = useState(0);
  const n = TESTIMONIALS.length;
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t("home.test.eyebrow")}</Eyebrow>
          <h2 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
            {t("home.test.title")}
          </h2>
          <p className="mt-5 text-neutral-600">{t("home.test.body")}</p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {TESTIMONIALS.map((tm) => (
                <div key={tm.name} className="w-full shrink-0 px-2 sm:px-8">
                  <figure className="mx-auto max-w-3xl rounded-3xl bg-[#f3f2ef] p-8 text-center ring-1 ring-neutral-200 sm:p-12">
                    <Quote className="mx-auto size-9 text-neutral-300" aria-hidden />
                    <blockquote className="mt-6 text-xl font-medium leading-relaxed tracking-tight text-neutral-900 sm:text-2xl">
                      &ldquo;{tx(lang, tm.quote, tm.quoteTe)}&rdquo;
                    </blockquote>
                    <figcaption className="mt-8">
                      <div className="text-sm font-semibold text-neutral-900">{tm.name}</div>
                      <div className="text-sm text-neutral-500">{tx(lang, tm.role, tm.roleTe)}</div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */
function Faq() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(0);
  return (
    <section style={{ backgroundColor: OFFWHITE }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="text-center">
          <Eyebrow>{t("home.faq.eyebrow")}</Eyebrow>
          <h2 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
            {t("home.faq.title")}
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-neutral-200">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 py-4 text-left"
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors ${
                        isOpen ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-base font-medium tracking-tight text-neutral-900">{tx(lang, f.q, f.qTe)}</span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-neutral-300 text-neutral-700">
                      {isOpen ? <Minus className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                    </span>
                  </button>
                  <div className={`accordion-panel ${isOpen ? "open" : ""}`}>
                    <div>
                      <p className="pb-5 pl-11 pr-12 text-sm leading-relaxed text-neutral-600">{tx(lang, f.a, f.aTe)}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */
function Contact() {
  const { t, lang } = useI18n();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await api("/contact", {
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          subject: form.subject || undefined,
          message: form.message,
        },
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "w-full border-0 border-b border-neutral-300 bg-transparent py-2.5 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900 transition-colors";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <Eyebrow>{t("home.contact.eyebrow")}</Eyebrow>
            <h2 className="mt-6 text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
              {t("home.contact.title")}
            </h2>
            <p className="mt-5 max-w-md text-neutral-600 leading-relaxed">{t("home.contact.body")}</p>
            <div className="mt-10 space-y-5">
              <ContactRow icon={<Phone className="size-5" aria-hidden />} value={CONTACT.phone} />
              <ContactRow icon={<Mail className="size-5" aria-hidden />} value={CONTACT.email} />
              <ContactRow icon={<MapPin className="size-5" aria-hidden />} value={tx(lang, CONTACT.address, CONTACT.addressTe)} />
            </div>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <div className="rounded-3xl bg-[#f3f2ef] p-7 ring-1 ring-neutral-200 sm:p-9">
              {sent ? (
                <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                  <CheckCircle2 className="size-12 text-neutral-900" aria-hidden />
                  <h3 className="mt-4 text-xl font-medium tracking-tight text-neutral-900">{t("home.contact.sentTitle")}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{t("home.contact.sentBody")}</p>
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("home.contact.name")}</span>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("home.contact.namePh")}
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("home.contact.email")}</span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t("home.contact.emailPh")}
                        className={field}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("home.contact.subject")}</span>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t("home.contact.subjectPh")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("home.contact.message")}</span>
                    <textarea
                      required
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("home.contact.messagePh")}
                      className={`${field} resize-none`}
                    />
                  </label>
                  {error && (
                    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send message"}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-neutral-900 text-white">{icon}</span>
      <span className="text-[15px] text-neutral-800">{value}</span>
    </div>
  );
}

/* ───────────────────────── CTA card ───────────────────────── */
function CtaCard() {
  const { t } = useI18n();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 sm:pb-28">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-6 py-12 sm:px-12 sm:py-14">
            <div
              className="pointer-events-none absolute -right-10 top-0 h-full w-1/2 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 14px)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-neutral-900">
                  <Gavel className="size-6" aria-hidden />
                </span>
                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    {t("home.cta.title")}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-400">
                    {t("home.cta.body")}
                  </p>
                </div>
              </div>
              <Link
                href="/book"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
              >
                {t("home.cta.button")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
