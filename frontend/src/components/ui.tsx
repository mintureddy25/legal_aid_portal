import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium min-h-11 px-5 text-[15px] transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none [touch-action:manipulation]";
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700",
  secondary: "bg-navy-800 text-white hover:bg-navy-600 active:bg-navy-900",
  ghost: "bg-transparent text-navy-800 ring-1 ring-inset ring-line hover:bg-navy-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: BtnVariant; loading?: boolean }) {
  return (
    <button className={`${btnBase} ${btnVariants[variant]} ${className}`} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  href,
}: {
  variant?: BtnVariant;
  className?: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className={`${btnBase} ${btnVariants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-surface ring-1 ring-line shadow-sm ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-600" aria-hidden> *</span>}
      </label>
      {hint && (
        <p id={`${htmlFor}-hint`} className="mt-0.5 text-xs text-muted">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full min-h-11 rounded-lg bg-white px-3.5 text-[15px] text-ink ring-1 ring-inset ring-line placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 outline-none";

export function Spinner({ className = "size-5" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden />;
}

/** Centered loading row for async sections. */
export function LoadingState({ label = "Loading…", className = "" }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-2 py-12 text-sm text-muted ${className}`}
    >
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

/**
 * Client-side pager. Hidden when there's a single page. Page numbers are 1-based.
 */
export function Pagination({
  page,
  totalPages,
  onChange,
  className = "",
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;
  const navBtn =
    "grid size-9 place-items-center rounded-lg bg-white text-ink ring-1 ring-inset ring-line hover:bg-navy-50 disabled:opacity-40 disabled:pointer-events-none [touch-action:manipulation]";
  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={navBtn}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      <span className="px-2 text-sm text-muted tabular">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={navBtn}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
