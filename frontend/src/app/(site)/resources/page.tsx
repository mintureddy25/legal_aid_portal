"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api";
import { Container, Badge } from "@/components/ui";

interface PostMeta {
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  createdAt: string;
}

export default function ResourcesPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<PostMeta[] | null>(null);

  useEffect(() => {
    api<PostMeta[]>("/blog").then(setPosts).catch(() => setPosts([]));
  }, []);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
        {t("res.title")}
      </h1>
      <p className="mt-2 text-muted">{t("res.subtitle")}</p>

      {posts && posts.length === 0 && (
        <div className="mt-10 rounded-2xl bg-surface p-10 text-center ring-1 ring-line">
          <BookOpen className="mx-auto size-8 text-slate-300" aria-hidden />
          <p className="mt-3 text-muted">{t("res.empty")}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((p) => (
          <Link
            key={p.slug}
            href={`/resources/${p.slug}`}
            className="group flex flex-col rounded-2xl bg-surface p-5 ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-brand-300"
          >
            {p.category && (
              <Badge className="mb-3 self-start bg-brand-50 text-brand-700 ring-brand-600/20">
                {p.category}
              </Badge>
            )}
            <h2 className="font-display text-lg font-semibold text-navy-800 group-hover:text-brand-600">
              {p.title}
            </h2>
            {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p>}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
              {t("res.read")}
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
