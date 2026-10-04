import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { useStore } from "@/lib/store";
import { PROS } from "@/lib/data";

export const Route = createFileRoute("/confirmation/$code")({
  head: () => ({
    meta: [
      { title: "ההזמנה התקבלה — Prozo" },
      { name: "description", content: "בקשת ההזמנה שלכם התקבלה." },
      { property: "og:title", content: "ההזמנה התקבלה — Prozo" },
      { property: "og:description", content: "מעקב אחר סטטוס ההזמנה." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { code } = Route.useParams();
  const { bookings } = useStore();
  const b = bookings.find((x) => x.code === code);
  const pro = PROS.find((p) => p.id === b?.proId);
  const done = b?.status === "accepted" ? 3 : 2;
  const timeline = ["בקשת ההזמנה נשלחה", "התשלום אושר (מוחזק בנאמנות)", "המקצוען מאשר את המשמרת", "המשמרת הושלמה", "התשלום מועבר למקצוען"];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-primary shadow-glow"><CheckCircle2 className="h-8 w-8" /></div>
      <h1 className="mt-6 text-3xl font-bold">בקשת ההזמנה נשלחה!</h1>
      <p className="mt-2 text-muted-foreground">{pro ? `${pro.name} יאשר/תאשר בקרוב.` : "נעדכן אתכם בקרוב."} עדכונים יישלחו אל {b?.email ?? "האימייל שלכם"}.</p>
      <div className="card-surface mx-auto mt-8 inline-block px-8 py-4">
        <p className="text-xs text-muted-foreground">קוד הזמנה</p>
        <p dir="ltr" className="font-display text-3xl font-bold tracking-wider text-primary">{code}</p>
      </div>
      <ol className="card-surface mt-8 space-y-4 p-6 text-start">
        {timeline.map((t, i) => (
          <li key={t} className="flex items-center gap-3">
            {i < done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            <span className={i < done ? "" : "text-muted-foreground"}>{t}</span>
            {i === done && <span className="ms-auto rounded-full bg-warning/15 px-2 py-0.5 text-xs text-warning">בתהליך</span>}
          </li>
        ))}
      </ol>
      {b && <p className="mt-4 text-sm text-muted-foreground">{b.date} · <span dir="ltr">{b.start}–{b.end}</span> · {b.location} · ₪{b.total}</p>}
      <Link to="/" className="btn-ghost mt-8">חזרה לדף הבית</Link>
    </div>
  );
}
