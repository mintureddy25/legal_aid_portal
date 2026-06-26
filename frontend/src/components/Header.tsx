"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";

const links = [
  { href: "/apply", key: "nav.apply" },
  { href: "/track", key: "nav.track" },
  { href: "/resources", key: "nav.resources" },
  { href: "/book", key: "nav.book" },
];

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`font-grotesk sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16 lg:h-20">
        <Link href="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-neutral-900">
          <Image src="/logo.png" alt="Nyaya Seva" width={36} height={36} className="size-9 rounded-xl object-contain" priority />
          Nyaya Seva
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-900/5 transition-colors"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LangToggle />
          <Link
            href="/admin/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            {t("nav.admin")}
          </Link>
          <Link
            href="/apply"
            className="group inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            {t("hero.cta")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-lg text-neutral-900 hover:bg-neutral-900/5"
            aria-label={t("nav.menu")}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-neutral-200 bg-white px-4 pb-4 pt-2" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 min-h-11 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-900/5"
            >
              {t(l.key)}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-500 hover:bg-neutral-900/5"
          >
            {t("nav.admin")}
          </Link>
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-3 text-base font-semibold text-white"
          >
            {t("hero.cta")}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      )}
    </header>
  );
}
