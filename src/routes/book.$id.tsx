import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, CreditCard, Check } from "lucide-react";
import { PROS, calcPrice, hoursBetween, professionLabel } from "@/lib/data";
import { useStore } from "@/lib/store";

type S = { date?: string | undefined; start?: string | undefined; end?: string | undefined };

export const Route = createFileRoute("/book/$id")({
  validateSearch: (s: Record<string, unknown>): S => ({
    date: s['date'] ? String(s['date']) : undefined,
    start: s['start'] ? String(s['start']) : undefined,
    end: s['end'] ? String(s['end']) : undefined,
  }),
  loader: ({ params }) => {
    const pro = PROS.find((p) => p.id === params.id);
    if (!pro) throw notFound();
    return { pro };
  },
  head: () => ({
    meta: [
      { title: "Secure checkout — Prozo" },
      { name: "description", content: "Complete your booking. Your card is authorized in escrow until the shift is done." },
      { property: "og:title", content: "Secure checkout — Prozo" },
      { property: "og:description", content: "Book a certified event professional securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookPage,
});

const steps = ["Event", "Contact", "Payment"];

function BookPage() {
  const { pro } = Route.useLoaderData();
  const s = Route.useSearch();
  const { addBooking } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    location: "", date: s['date'] ?? "", start: s['start'] ?? "18:00", end: s['end'] ?? "23:00",
    name: "", phone: "", email: "", card: "", exp: "", cvc: "", holder: "",
  });
  const [processing, setProcessing] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const hours = Math.max(pro.minHours, hoursBetween(f.start, f.end));
  const price = calcPrice(pro.rate, hours);

  const valid = [
    f.location && f.date && f.start && f.end,
    f.name && f.phone.length >= 9 && /\S+@\S+\.\S+/.test(f.email),
    f.card.replace(/\s/g, "").length >= 15 && f.exp.length >= 4 && f.cvc.length >= 3 && f.holder,
  ];

  const submit = () => {
    setProcessing(true);
    setTimeout(() => {
      const code = "PZ-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      addBooking({ code, proId: pro.id, date: f.date, start: f.start, end: f.end, hours, location: f.location, clientName: f.name, phone: f.phone, email: f.email, total: price.total, status: "pending", createdAt: new Date().toISOString().slice(0, 10) });
      nav({ to: "/confirmation/$code", params: { code } });
    }, 1400);
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-3xl font-bold">Book {pro.name}</h1>
        <ol className="mt-6 flex gap-2">
          {steps.map((st, i) => (
            <li key={st} className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm ${i === step ? "border-primary bg-accent" : i < step ? "text-success" : "text-muted-foreground"}`}>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-xs">{i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>{st}
            </li>
          ))}
        </ol>

        <div className="card-surface mt-6 space-y-4 p-6">
          {step === 0 && (<>
            <label className="block text-sm">Event address<input className="field mt-1" placeholder="Street, city" value={f.location} onChange={set("location")} /></label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm">Date<input type="date" className="field mt-1" value={f.date} onChange={set("date")} /></label>
              <label className="text-sm">Start<input type="time" className="field mt-1" value={f.start} onChange={set("start")} /></label>
              <label className="text-sm">End<input type="time" className="field mt-1" value={f.end} onChange={set("end")} /></label>
            </div>
          </>)}
          {step === 1 && (<>
            <p className="text-sm text-muted-foreground">No account needed — we'll send booking updates here.</p>
            <label className="block text-sm">Full name<input className="field mt-1" value={f.name} onChange={set("name")} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">Phone<input type="tel" className="field mt-1" placeholder="050-000-0000" value={f.phone} onChange={set("phone")} /></label>
              <label className="text-sm">Email<input type="email" className="field mt-1" value={f.email} onChange={set("email")} /></label>
            </div>
          </>)}
          {step === 2 && (<>
            <div className="flex items-center gap-2 rounded-lg bg-accent p-3 text-sm"><Lock className="h-4 w-4 text-primary" />Your card is only authorized (held in escrow). Charged after the shift is completed.</div>
            <label className="block text-sm">Cardholder name<input className="field mt-1" value={f.holder} onChange={set("holder")} /></label>
            <label className="block text-sm">Card number
              <div className="relative mt-1"><CreditCard className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                <input className="field ps-10" inputMode="numeric" placeholder="4242 4242 4242 4242" value={f.card} onChange={(e) => setF({ ...f, card: formatCard(e.target.value) })} /></div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">Expiry<input className="field mt-1" placeholder="MM/YY" maxLength={5} value={f.exp} onChange={set("exp")} /></label>
              <label className="text-sm">CVC<input className="field mt-1" placeholder="123" maxLength={4} value={f.cvc} onChange={set("cvc")} /></label>
            </div>
          </>)}

          <div className="flex justify-between pt-2">
            <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)} style={{ visibility: step === 0 ? "hidden" : "visible" }}>Back</button>
            {step < 2
              ? <button className="btn-primary" disabled={!valid[step]} onClick={() => setStep(step + 1)}>Continue</button>
              : <button className="btn-primary" disabled={!valid[2] || processing} onClick={submit}>{processing ? "Authorizing…" : `Authorize ₪${price.total}`}</button>}
          </div>
        </div>
      </div>

      <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <img src={pro.avatar} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <div><b>{pro.name}</b><p className="text-xs text-muted-foreground">{professionLabel(pro.profession)} · {pro.city}</p></div>
        </div>
        <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Date</dt><dd>{f.date || "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Time</dt><dd>{f.start}–{f.end}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal ({hours}h × ₪{pro.rate})</dt><dd>₪{price.subtotal}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee</dt><dd>₪{price.fee}</dd></div>
          <div className="flex justify-between border-t pt-3 text-lg font-bold"><dt>Total</dt><dd>₪{price.total}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
