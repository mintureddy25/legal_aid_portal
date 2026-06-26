import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import { API_URL } from "@/lib/api";
import { Container } from "@/components/ui";

interface Post {
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  body: string;
  coverImage?: string | null;
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

  if (!post) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-md rounded-3xl bg-[#f3f2ef] p-10 text-center ring-1 ring-neutral-200">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-neutral-900 text-white">
            <Clock className="size-7" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-medium tracking-tight text-neutral-900">Coming soon</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            This guide is being written by our volunteer lawyers. Check back shortly — or reach out
            and we&apos;ll help you directly.
          </p>
          <Link
            href="/resources"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to resources
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All resources
        </Link>
        {post.coverImage && (
          <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-neutral-200">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
          </div>
        )}
        {post.category && (
          <span className="mt-6 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
            {post.category}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-8 whitespace-pre-wrap text-[17px] leading-relaxed text-neutral-800">
          {post.body}
        </div>
      </article>
    </Container>
  );
}
