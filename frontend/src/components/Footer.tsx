"use client";

import Link from "next/link";
import { Scale, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-brand-500">
                <Scale className="size-4" aria-hidden />
              </span>
              Legal Aid Portal
            </div>
            <p className="mt-3 text-sm leading-relaxed text-navy-200">{t("footer.tagline")}</p>
          </div>
          <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
            <Link href="/apply" className="hover:text-white">{t("nav.apply")}</Link>
            <Link href="/track" className="hover:text-white">{t("nav.track")}</Link>
            <Link href="/resources" className="hover:text-white">{t("nav.resources")}</Link>
            <Link href="/book" className="hover:text-white">{t("nav.book")}</Link>
          </nav>
          <div className="rounded-xl bg-white/5 p-4 text-sm md:max-w-xs">
            <div className="flex items-center gap-2 font-medium text-white">
              <Phone className="size-4 text-brand-300" aria-hidden />
              Urgent help
            </div>
            <p className="mt-2 text-navy-200">{t("footer.urgent")}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-navy-200">
          {t("footer.rights")} · © {new Date().getFullYear()} Legal Aid Portal
        </div>
      </div>
    </footer>
  );
}
