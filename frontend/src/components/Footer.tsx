"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="font-grotesk mt-auto bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white">
              <Image src="/logo.png" alt="Nyaya Seva" width={36} height={36} className="size-9 rounded-xl bg-white object-contain p-0.5" />
              Nyaya Seva
            </div>
            <p className="mt-4 text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <nav className="flex flex-col gap-3 text-sm" aria-label="Footer">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Explore</span>
            <Link href="/apply" className="hover:text-white transition-colors">{t("nav.apply")}</Link>
            <Link href="/track" className="hover:text-white transition-colors">{t("nav.track")}</Link>
            <Link href="/resources" className="hover:text-white transition-colors">{t("nav.resources")}</Link>
            <Link href="/book" className="hover:text-white transition-colors">{t("nav.book")}</Link>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact</span>
            <a href="tel:+918309286918" className="flex items-center gap-2 hover:text-white transition-colors"><Phone className="size-4" aria-hidden /> +91 83092 86918</a>
            <a href="mailto:pabbojushivateja2000@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors break-all"><Mail className="size-4 shrink-0" aria-hidden /> pabbojushivateja2000@gmail.com</a>
            <span className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" aria-hidden /> Hyderabad, Telangana</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.rights")} · © {new Date().getFullYear()} Nyaya Seva</span>
          <span>A pro bono initiative · Built with care</span>
        </div>
      </div>
    </footer>
  );
}
