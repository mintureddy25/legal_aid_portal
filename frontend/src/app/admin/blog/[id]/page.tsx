"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { Button, Field, inputClass } from "@/components/ui";

interface PostForm {
  title: string;
  category: string;
  excerpt: string;
  body: string;
  published: boolean;
}

const empty: PostForm = { title: "", category: "", excerpt: "", body: "", published: false };

export default function BlogEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const { token } = useAdminAuth();
  const router = useRouter();
  const [form, setForm] = useState<PostForm>(empty);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (!isNew && token) {
      api<PostForm>(`/blog/admin/${id}`, { token }).then((p) => {
        setForm({
          title: p.title,
          category: p.category ?? "",
          excerpt: p.excerpt ?? "",
          body: p.body,
          published: p.published,
        });
        setLoaded(true);
      });
    }
  }, [id, isNew, token]);

  const set = <K extends keyof PostForm>(k: K, v: PostForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save(publish?: boolean) {
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || undefined,
      excerpt: form.excerpt.trim() || undefined,
      body: form.body,
      published: publish ?? form.published,
    };
    if (isNew) {
      await api("/blog/admin", { method: "POST", body: payload, token });
    } else {
      await api(`/blog/admin/${id}`, { method: "PATCH", body: payload, token });
    }
    router.push("/admin/blog");
  }

  async function remove() {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await api(`/blog/admin/${id}`, { method: "DELETE", token });
    router.push("/admin/blog");
  }

  if (!loaded) return <div className="text-sm text-muted">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-800">
        <ArrowLeft className="size-4" aria-hidden />
        Resources
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-navy-800">
        {isNew ? "New article" : "Edit article"}
      </h1>

      <div className="mt-6 grid gap-4 rounded-2xl bg-surface p-6 ring-1 ring-line">
        <Field label="Title" htmlFor="title" required>
          <input id="title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="cat">
            <input id="cat" className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Tenant Rights" />
          </Field>
          <Field label="Excerpt" htmlFor="excerpt">
            <input id="excerpt" className={inputClass} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </Field>
        </div>
        <Field label="Body" htmlFor="body" required hint="Plain text. Line breaks are preserved.">
          <textarea
            id="body"
            rows={14}
            className={`${inputClass} min-h-64 py-2.5 leading-relaxed`}
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => save(true)} loading={saving} disabled={saving || !form.title.trim()}>
          Publish
        </Button>
        <Button variant="ghost" onClick={() => save(false)} disabled={saving}>
          Save as draft
        </Button>
        {!isNew && (
          <button onClick={remove} className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700">
            <Trash2 className="size-4" aria-hidden />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
