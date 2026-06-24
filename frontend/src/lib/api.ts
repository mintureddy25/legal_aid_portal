export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010/api";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3010";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface ReqOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

export async function api<T = unknown>(
  path: string,
  { method = "GET", body, token }: ReqOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = Array.isArray(data.message) ? data.message.join(", ") : data.message ?? message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  return (ct.includes("application/json") ? res.json() : res.text()) as Promise<T>;
}
