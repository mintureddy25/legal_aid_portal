"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { Badge, LoadingState, Pagination } from "@/components/ui";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  published: boolean;
  updatedAt: string;
}

const POSTS_PER_PAGE = 10;

export default function AdminBlog() {
  const { token } = useAdminAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (token) api<Post[]>("/blog/admin/all", { token }).then(setPosts).catch(() => setPosts([]));
  }, [token]);

  const totalPages = posts ? Math.ceil(posts.length / POSTS_PER_PAGE) || 1 : 1;
  const pagePosts = useMemo(
    () => (posts ? posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE) : []),
    [posts, page],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-navy-800">Resources</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
        >
          <Plus className="size-4" aria-hidden />
          New article
        </Link>
      </div>

      {posts === null && <LoadingState label="Loading resources…" />}

      <div className="mt-6 grid gap-3">
        {posts && posts.length === 0 && (
          <p className="rounded-2xl bg-surface p-10 text-center text-sm text-muted ring-1 ring-line">
            No articles yet. Create your first guide.
          </p>
        )}
        {pagePosts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/blog/${p.id}`}
            className="flex items-center justify-between rounded-2xl bg-surface p-4 ring-1 ring-line hover:ring-brand-300"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-navy-800">{p.title}</span>
                {p.published ? (
                  <Badge className="bg-brand-50 text-brand-700 ring-brand-600/20">
                    <Eye className="mr-1 size-3" aria-hidden /> Live
                  </Badge>
                ) : (
                  <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                    <EyeOff className="mr-1 size-3" aria-hidden /> Draft
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 text-xs text-muted">
                {p.category ?? "Uncategorised"} · /{p.slug}
              </div>
            </div>
            <Pencil className="size-4 text-muted" aria-hidden />
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
    </div>
  );
}
