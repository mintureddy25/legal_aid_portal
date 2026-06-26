"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, FileText, CalendarClock, Inbox, LogOut, Scale } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/adminAuth";

const nav = [
  { href: "/admin", label: "Cases", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/blog", label: "Resources", icon: FileText },
  { href: "/admin/slots", label: "Slots", icon: CalendarClock },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <Shell>{children}</Shell>
    </AdminAuthProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { token, ready, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (ready && !token && !isLogin) router.replace("/admin/login");
  }, [ready, token, isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (!ready || !token) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas md:flex-row">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="flex shrink-0 flex-col border-b border-line bg-navy-800 text-white md:w-60 md:border-b-0 md:border-r md:border-white/10">
        <div className="flex items-center justify-between px-4 py-4 md:flex-col md:items-start md:gap-6">
          <Link href="/admin" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-500">
              <Scale className="size-4" aria-hidden />
            </span>
            Admin
          </Link>
          <nav className="flex gap-1 md:w-full md:flex-col" aria-label="Admin">
            {nav.map((n) => {
              const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-white/15 text-white" : "text-navy-100 hover:bg-white/10"
                  }`}
                >
                  <n.icon className="size-4" aria-hidden />
                  <span className="hidden sm:inline">{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="hidden items-center gap-2 px-4 py-2 text-sm text-navy-200 hover:text-white md:mt-auto md:flex md:py-4"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
