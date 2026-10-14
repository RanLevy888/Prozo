import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FileCheck, CalendarDays, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/portal")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "אזור המקצוענים — Prozo" },
      { name: "description", content: "ניהול הזמנות, מסמכים וזמינות ב-Prozo." },
      { property: "og:title", content: "אזור המקצוענים — Prozo" },
      { property: "og:description", content: "סביבת העבודה שלכם ב-Prozo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalLayout,
});

function PortalLayout() {
  const { loggedIn, account, logout, hydrated, pros, setAvailableNow } = useStore();
  const me = pros.find((p) => p.id === account?.proId);
  const nav = useNavigate();
  useEffect(() => {
    if (hydrated && !loggedIn) nav({ to: "/login" });
  }, [hydrated, loggedIn, nav]);
  if (!loggedIn || !account) return <div className="p-20 text-center text-muted-foreground">טוען…</div>;

  const links = [
    { to: "/portal", label: "לוח בקרה", I: LayoutDashboard },
    { to: "/portal/documents", label: "מסמכים", I: FileCheck },
    { to: "/portal/availability", label: "זמינות", I: CalendarDays },
  ] as const;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
      <aside className="card-surface flex h-fit gap-1 overflow-x-auto p-2 md:flex-col">
        <div className="hidden px-3 py-3 md:block">
          <p className="font-semibold">{account.name}</p>
          <p className="text-xs text-muted-foreground">{account.email}</p>
          <button onClick={() => setAvailableNow(!me?.availableNow)} aria-pressed={!!me?.availableNow} className={`mt-3 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs ${me?.availableNow ? "border-success/40 text-success" : "text-muted-foreground"}`}>
            <span>{me?.availableNow ? "זמין עכשיו" : "לא זמין"}</span>
            <span className={`h-2 w-2 rounded-full ${me?.availableNow ? "bg-success" : "bg-muted-foreground"}`} />
          </button>
        </div>
        {links.map(({ to, label, I }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" activeProps={{ className: "bg-accent text-foreground" }}>
            <I className="h-4 w-4" />{label}
          </Link>
        ))}
        <button onClick={() => { logout(); nav({ to: "/", replace: true }); }} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
          <LogOut className="h-4 w-4" />התנתקות
        </button>
      </aside>
      <section><Outlet /></section>
    </div>
  );
}
