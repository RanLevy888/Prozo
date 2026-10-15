import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Wallet, CalendarCheck, Inbox, MapPin, Clock } from "lucide-react";
import { useStore, accountStatus, type Booking } from "@/lib/store";
import { FIXED_FEE } from "@/lib/data";

export const Route = createFileRoute("/portal/")({
  component: Dashboard,
});

function Dashboard() {
  const { bookings: all, setBookingStatus, account, pros, setAvailableNow } = useStore();
  const me = pros.find((p) => p.id === account?.proId);
  const bookings = all.filter((b) => b.proId === account?.proId);
  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings.filter((b) => b.status === "accepted").sort((a, b) => a.date.localeCompare(b.date));
  const earnings = upcoming.reduce((s, b) => s + (b.total - FIXED_FEE), 0);
  const st = account ? accountStatus(account) : "incomplete";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">שלום, {account?.name.split(" ")[0]}</h1>
        <button onClick={() => { setAvailableNow(!me?.availableNow); toast(me?.availableNow ? "סומנתם כלא זמינים" : "סומנתם כזמינים עכשיו"); }} aria-pressed={!!me?.availableNow}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${me?.availableNow ? "border-success/40 bg-success/10 text-success" : "text-muted-foreground"}`}>
          <span className={`h-2 w-2 rounded-full ${me?.availableNow ? "bg-success" : "bg-muted-foreground"}`} />
          {me?.availableNow ? "זמין עכשיו" : "לא זמין"}
        </button>
      </div>
      {st !== "approved" && <div className={`rounded-xl border p-4 text-sm ${st === "rejected" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-warning/40 bg-warning/10 text-warning"}`}>
        {st === "incomplete" && "הפרופיל שלכם עדיין לא מאומת. העלו את המסמכים בעמוד \"מסמכים\" כדי שנוכל לאשר אתכם — עד אז לקוחות לא יוכלו להזמין אתכם."}
        {st === "pending_approval" && "המסמכים שלכם בבדיקה. אחרי האישור תוכלו לקבל הזמנות."}
        {st === "rejected" && "המסמכים נדחו. העלו מסמכים מעודכנים בעמוד \"מסמכים\"."}
      </div>}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { I: Wallet, l: "סך ההכנסות", v: `₪${earnings.toLocaleString()}` },
          { I: Inbox, l: "בקשות חדשות", v: pending.length },
          { I: CalendarCheck, l: "עבודות קרובות", v: upcoming.length },
        ].map(({ I, l, v }) => (
          <div key={l} className="card-surface p-5">
            <I className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">{l}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">בקשות נכנסות</h2>
        {pending.length === 0 && <p className="card-surface p-6 text-sm text-muted-foreground">עדיין אין בקשות נכנסות.</p>}
        <div className="space-y-3">
          {pending.map((b) => (
            <Row key={b.code} b={b}>
              <button className="btn-ghost py-1.5 text-sm" onClick={() => { setBookingStatus(b.code, "declined"); toast("הבקשה נדחתה"); }}>דחייה</button>
              <button className="btn-primary py-1.5 text-sm" onClick={() => { setBookingStatus(b.code, "accepted"); toast.success("ההזמנה אושרה"); }}>אישור</button>
            </Row>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">עבודות מאושרות קרובות</h2>
        <div className="space-y-3">
          {upcoming.length === 0 && <p className="card-surface p-6 text-sm text-muted-foreground">אין עבודות מאושרות כרגע.</p>}
          {upcoming.map((b) => <Row key={b.code} b={b}><span className="rounded-full bg-success/15 px-3 py-1 text-xs text-success">מאושר</span></Row>)}
        </div>
      </section>
    </div>
  );
}

function Row({ b, children }: { b: Booking; children: React.ReactNode }) {
  return (
    <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="font-medium">{b.clientName} <span className="text-xs text-muted-foreground">· {b.code}</span></p>
        <p className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.date} · <span className="time-ltr">{b.start}–{b.end}</span></span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.location}</span>
        </p>
      </div>
      <span className="font-semibold">₪{(b.total - FIXED_FEE)}</span>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
