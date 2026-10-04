import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Wallet, CalendarCheck, Inbox, MapPin, Clock } from "lucide-react";
import { useStore, type Booking } from "@/lib/store";

export const Route = createFileRoute("/portal/")({
  component: Dashboard,
});

function Dashboard() {
  const { bookings, setBookingStatus, account } = useStore();
  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings.filter((b) => b.status === "accepted").sort((a, b) => a.date.localeCompare(b.date));
  const earnings = upcoming.reduce((s, b) => s + Math.round(b.total / 1.1), 0) + 12480;
  const docsOk = account && Object.values(account.docs).every((d) => d === "approved");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome back, {account?.name.split(" ")[0]}</h1>
      {!docsOk && <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">Some documents are still pending review. Your profile goes fully live once all are approved.</div>}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { I: Wallet, l: "Total earnings", v: `₪${earnings.toLocaleString()}` },
          { I: Inbox, l: "New requests", v: pending.length },
          { I: CalendarCheck, l: "Upcoming shifts", v: upcoming.length },
        ].map(({ I, l, v }) => (
          <div key={l} className="card-surface p-5">
            <I className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">{l}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Incoming requests</h2>
        {pending.length === 0 && <p className="card-surface p-6 text-sm text-muted-foreground">No new requests right now.</p>}
        <div className="space-y-3">
          {pending.map((b) => (
            <Row key={b.code} b={b}>
              <button className="btn-ghost py-1.5 text-sm" onClick={() => { setBookingStatus(b.code, "declined"); toast("Request declined"); }}>Decline</button>
              <button className="btn-primary py-1.5 text-sm" onClick={() => { setBookingStatus(b.code, "accepted"); toast.success("Shift confirmed"); }}>Accept</button>
            </Row>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Upcoming confirmed shifts</h2>
        <div className="space-y-3">
          {upcoming.map((b) => <Row key={b.code} b={b}><span className="rounded-full bg-success/15 px-3 py-1 text-xs text-success">Confirmed</span></Row>)}
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
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.date} · {b.start}–{b.end}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.location}</span>
        </p>
      </div>
      <span className="font-semibold">₪{Math.round(b.total / 1.1)}</span>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
