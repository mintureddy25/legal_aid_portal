"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/adminAuth";
import { Button, Field, inputClass } from "@/components/ui";

export default function AdminLogin() {
  const { setToken } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: { username, password },
      });
      setToken(res.token);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-navy-800 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-7 shadow-xl ring-1 ring-line">
        <div className="flex items-center gap-2 font-display text-xl font-semibold text-navy-800">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-white">
            <Scale className="size-5" aria-hidden />
          </span>
          Owner Login
        </div>
        <p className="mt-1 text-sm text-muted">Manage cases, chats, resources and slots.</p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="Username" htmlFor="username">
            <input
              id="username"
              className={inputClass}
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                className={`${inputClass} pr-11`}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} disabled={loading} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
