"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 bg-navy-800 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-500">
            <Scale className="size-5" aria-hidden />
          </span>
          Legal Aid Portal
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-navy-100 hover:bg-white/10 transition-colors"
            >
              {t(l.key)}
            </Link>
          ))}
          <LangToggle className="ml-1" />
          <Link
            href="/admin/login"
            className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-200 hover:text-white"
          >
            {t("nav.admin")}
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-lg hover:bg-white/10"
            aria-label={t("nav.menu")}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/10 bg-navy-800 px-4 pb-4 pt-2" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 min-h-11 py-3 text-base font-medium text-navy-100 hover:bg-white/10"
            >
              {t(l.key)}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 text-base font-medium text-navy-200 hover:bg-white/10"
          >
            {t("nav.admin")}
          </Link>
        </nav>
      )}
    </header>
  );
}
