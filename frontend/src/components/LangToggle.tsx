"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "te" : "en")}
      className={`inline-flex items-center gap-1.5 rounded-full min-h-9 px-3 text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 hover:text-neutral-900 hover:bg-neutral-900/5 transition-colors ${className}`}
      aria-label={`Switch language to ${lang === "en" ? "Telugu" : "English"}`}
    >
      <Languages className="size-4" aria-hidden />
      <span data-lang={lang === "en" ? "te" : "en"}>{t("lang.toggle")}</span>
    </button>
  );
}
