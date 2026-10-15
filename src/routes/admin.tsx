import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { useStore, accountStatus, type AccountStatus } from "@/lib/store";
import { professionLabel } from "@/lib/data";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "ניהול ואישור מקצוענים — Prozo" },
      { name: "description", content: "בדיקת מסמכים ואישור אנשי מקצוע חדשים ב-Prozo." },
      { property: "og:title", content: "ניהול ואישור מקצוענים — Prozo" },
      { property: "og:description", content: "אישור או דחייה של מסמכי אנשי מקצוע." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const DOC_LABEL: Record<string, string> = { id: "תעודה מזהה", cert: "תעודה מקצועית / רישיון", firstaid: "רענון עזרה ראשונה" };
const DOC_ST: Record<string, string> = { missing: "לא הועלה", pending: "ממתין", approved: "מאושר", rejected: "נדחה" };
const ST: Record<AccountStatus, { l: string; c: string }> = {
  incomplete: { l: "טרם הועלו מסמכים", c: "bg-secondary text-muted-foreground" },
  pending_approval: { l: "ממתין לאישור", c: "bg-warning/15 text-warning" },
  approved: { l: "מאושר", c: "bg-success/15 text-success" },
  rejected: { l: "נדחה", c: "bg-destructive/15 text-destructive" },
};
const order: AccountStatus[] = ["pending_approval", "incomplete", "rejected", "approved"];

function Admin() {
  const { accounts, reviewAccount, hydrated } = useStore();
  if (!hydrated) return <div className="p-20 text-center text-muted-foreground">טוען…</div>;
  const list = [...accounts].sort((a, b) => order.indexOf(accountStatus(a)) - order.indexOf(accountStatus(b)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">אישור מקצוענים</h1>
      <p className="mt-2 text-sm text-muted-foreground">מקצוען לא יכול לקבל הזמנות עד שהמסמכים שלו מאושרים כאן.</p>
      {list.length === 0 && <p className="card-surface mt-8 p-6 text-sm text-muted-foreground">עדיין לא נרשמו מקצוענים חדשים.</p>}
      <div className="mt-8 space-y-4">
        {list.map((a) => {
          const st = accountStatus(a);
          const uploaded = Object.values(a.docs).some((d) => d !== "missing");
          return (
            <div key={a.email} className="card-surface p-5">
              <div className="flex flex-wrap items-center gap-4">
                <img src={a.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(a.name)}`} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{professionLabel(a.profession)} · {a.city} · <span dir="ltr">{a.email}</span></p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${ST[st].c}`}>{ST[st].l}</span>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {Object.entries(a.docs).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="flex-1">{DOC_LABEL[k] ?? k}</span>
                    <span className="text-muted-foreground">{DOC_ST[v]}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end gap-2">
                <button className="btn-ghost py-1.5 text-sm" disabled={!uploaded || st === "rejected"} onClick={() => { reviewAccount(a.email, false); toast("המקצוען נדחה"); }}>דחייה</button>
                <button className="btn-primary py-1.5 text-sm" disabled={!uploaded || st === "approved"} onClick={() => { reviewAccount(a.email, true); toast.success("המקצוען אושר ויכול לקבל הזמנות"); }}>אישור</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
