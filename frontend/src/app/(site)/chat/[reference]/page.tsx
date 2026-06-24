"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Container } from "@/components/ui";
import { ChatBox } from "@/components/ChatBox";

export default function ChatPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = use(params);
  const { t } = useI18n();
  const ref = decodeURIComponent(reference).toUpperCase();

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/track?ref=${ref}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("track.title")}
        </Link>
        <div className="mt-3 flex items-baseline justify-between">
          <h1 className="font-display text-2xl font-semibold text-navy-800">{t("chat.title")}</h1>
          <span className="font-display text-sm font-semibold text-brand-600 tabular">{ref}</span>
        </div>
        <ChatBox reference={ref} me="CLIENT" className="mt-4 h-[65vh] min-h-[420px]" />
      </div>
    </Container>
  );
}
