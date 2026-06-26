"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api";
import { Container, Badge, LoadingState, Pagination } from "@/components/ui";

interface PostMeta {
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
  createdAt: string;
}

const POSTS_PER_PAGE = 9;

export default function ResourcesPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api<PostMeta[]>("/blog").then(setPosts).catch(() => setPosts([]));
  }, []);

  const totalPages = posts ? Math.ceil(posts.length / POSTS_PER_PAGE) : 1;
  const pagePosts = useMemo(
    () => (posts ? posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE) : []),
    [posts, page],
  );

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
        {t("res.title")}
      </h1>
      <p className="mt-2 text-muted">{t("res.subtitle")}</p>

      {posts === null && <LoadingState label={t("res.loading")} />}

      {posts && posts.length === 0 && (
        <div className="mt-10 rounded-2xl bg-surface p-10 text-center ring-1 ring-line">
          <BookOpen className="mx-auto size-8 text-slate-300" aria-hidden />
          <p className="mt-3 text-muted">{t("res.empty")}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((p) => (
          <Link
            key={p.slug}
            href={`/resources/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {p.coverImage && (
              <div className="relative h-44 overflow-hidden bg-neutral-200">
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              {p.category && (
                <Badge className="mb-3 self-start bg-neutral-100 text-neutral-700 ring-neutral-300">
                  {p.category}
                </Badge>
              )}
              <h2 className="text-lg font-medium tracking-tight text-ink group-hover:text-muted">
                {p.title}
              </h2>
              {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p>}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink">
                {t("res.read")}
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-8" />
    </Container>
  );
}
