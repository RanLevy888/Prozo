import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Zap, BadgeCheck, LifeBuoy, Shield, HeartPulse, Camera } from "lucide-react";
import { useStore, useT } from "@/lib/store";
import { CITIES, PROFESSIONS, PROS } from "@/lib/data";
import { ProCard } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prozo — Book certified event staff in minutes" },
      { name: "description", content: "On-demand marketplace for vetted lifeguards, security guards, medics and event photographers in Israel." },
      { property: "og:title", content: "Prozo — Book certified event staff in minutes" },
      { property: "og:description", content: "Vetted lifeguards, security, medics and photographers. No sign-up required." },
    ],
  }),
  component: Index,
});

const icons = { lifeguard: LifeBuoy, security: Shield, medic: HeartPulse, photographer: Camera };

function Index() {
  const t = useT();
  const { lang } = useStore();
  const nav = useNavigate();
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(4);

  const go = (p = profession) =>
    nav({ to: "/search", search: { profession: p || undefined, city: city || undefined, date: date || undefined, hours } });

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" /> {t.heroBadge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold sm:text-6xl">
              {t.heroTitle1}<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">{t.heroTitle2}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{t.heroSub}</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); go(); }} className="glass mx-auto mt-10 grid max-w-5xl gap-3 rounded-2xl p-3 shadow-glow sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.6fr_auto]">
            <label className="text-xs text-muted-foreground">{t.profession}
              <select className="field mt-1" value={profession} onChange={(e) => setProfession(e.target.value)}>
                <option value="">{t.any}</option>
                {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p[lang]}</option>)}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">{t.location}
              <input className="field mt-1" list="cities" placeholder="Tel Aviv" value={city} onChange={(e) => setCity(e.target.value)} />
              <datalist id="cities">{CITIES.map((c) => <option key={c.en} value={c.en} />)}</datalist>
            </label>
            <label className="text-xs text-muted-foreground">{t.date}
              <input type="date" className="field mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="text-xs text-muted-foreground">{t.duration}
              <input type="number" min={1} max={24} className="field mt-1" value={hours} onChange={(e) => setHours(+e.target.value)} />
            </label>
            <button className="btn-primary self-end py-3 sm:col-span-2 lg:col-span-1"><Search className="h-4 w-4" />{t.find}</button>
          </form>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
            {PROFESSIONS.map((p) => {
              const I = icons[p.id];
              return (
                <button key={p.id} onClick={() => go(p.id)} className="card-surface flex items-center gap-3 p-4 text-start transition hover:border-primary/50">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent"><I className="h-5 w-5 text-primary" /></span>
                  <span className="text-sm font-medium">{p[lang]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { I: ShieldCheck, h: "Every pro is vetted", p: "Licenses, ID and certifications are manually reviewed before anyone goes live." },
            { I: Zap, h: "Book without friction", p: "No account needed. Pick a pro, add details, done — in under 2 minutes." },
            { I: BadgeCheck, h: "Pay securely in escrow", p: "Your card is only authorized. Funds release after the shift is completed." },
          ].map(({ I, h, p }) => (
            <div key={h} className="card-surface p-6">
              <I className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{h}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">Top-rated pros</h2>
          <button onClick={() => go("")} className="text-sm text-primary hover:underline">View all →</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...PROS].sort((a, b) => b.rating - a.rating).slice(0, 8).map((p) => <ProCard key={p.id} pro={p} />)}
        </div>
      </section>
    </>
  );
}
