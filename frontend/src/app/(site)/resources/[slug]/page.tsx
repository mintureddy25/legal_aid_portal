import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { API_URL } from "@/lib/api";
import { Container } from "@/components/ui";

interface Post {
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  body: string;
  createdAt: string;
}

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/blog/post/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All resources
        </Link>
        {post.category && (
          <span className="mt-4 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20">
            {post.category}
          </span>
        )}
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy-800 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-8 whitespace-pre-wrap text-[17px] leading-relaxed text-ink">
          {post.body}
        </div>
      </article>
    </Container>
  );
}
