import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Zap, BadgeCheck, LifeBuoy, Shield, HeartPulse, Camera, Plug, Wrench, Sparkles, GlassWater } from "lucide-react";
import { CITIES, PROFESSIONS, PROS } from "@/lib/data";
import { ProCard } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prozo — אנשי מקצוע מאומתים, מוזמנים בדקות" },
      { name: "description", content: "מצילים, מאבטחים, חשמלאים, אינסטלטורים, צלמים ועוד — אנשי מקצוע מאומתים. הזמנה מהירה ללא הרשמה." },
      { property: "og:title", content: "Prozo — אנשי מקצוע מאומתים, מוזמנים בדקות" },
      { property: "og:description", content: "אנשי מקצוע מאומתים לכל עבודה. ללא צורך בהרשמה." },
    ],
  }),
  component: Index,
});

const icons = { lifeguard: LifeBuoy, security: Shield, medic: HeartPulse, photographer: Camera, electrician: Plug, plumber: Wrench, cleaning: Sparkles, waiter: GlassWater };

function Index() {
  const nav = useNavigate();
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(4);

  const go = (p = profession) =>
    nav({
      to: "/search",
      search: {
        profession: p || undefined,
        city: city.trim() || undefined,
        date: date || undefined,
        hours: hours || undefined,
      },
    });

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" /> מאומתים • מוסמכים • מבוטחים
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
              איש המקצוע הנכון,<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">בדיוק כשצריך</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              מצילים, מאבטחים, חשמלאים, אינסטלטורים, צלמים ועוד — כולם עם רישיונות ובדיקות רקע. מזמינים בדקות, בלי הרשמה.
            </p>
          </div>

          {/* action/method + names keep native submit working before hydration */}
          <form
            action="/search"
            method="get"
            onSubmit={(e) => { e.preventDefault(); go(); }}
            className="glass mx-auto mt-10 grid max-w-5xl gap-3 rounded-2xl p-3 shadow-glow sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.6fr_auto]"
          >
            <label className="text-xs text-muted-foreground">מקצוע
              <select name="profession" className="field mt-1" value={profession} onChange={(e) => setProfession(e.target.value)}>
                <option value="">כל המקצועות</option>
                {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">עיר / מיקום
              <input name="city" className="field mt-1" list="cities" placeholder="לדוגמה: תל אביב" value={city} onChange={(e) => setCity(e.target.value)} />
              <datalist id="cities">{CITIES.map((c) => <option key={c.he} value={c.he} />)}</datalist>
            </label>
            <label className="text-xs text-muted-foreground">תאריך
              <input name="date" type="date" className="field mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="text-xs text-muted-foreground">משך (שעות)
              <input name="hours" type="number" min={1} max={24} className="field mt-1" value={hours} onChange={(e) => setHours(+e.target.value)} />
            </label>
            <button type="submit" className="btn-primary self-end py-3 sm:col-span-2 lg:col-span-1"><Search className="h-4 w-4" />מצאו מקצוענים</button>
          </form>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
            {PROFESSIONS.map((p) => {
              const I = icons[p.id];
              return (
                <button key={p.id} type="button" onClick={() => go(p.id)} className="card-surface flex items-center gap-3 p-4 text-start transition hover:border-primary/50">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent"><I className="h-5 w-5 text-primary" /></span>
                  <span className="text-sm font-medium">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { I: ShieldCheck, h: "כל מקצוען עובר אימות", p: "רישיונות, תעודות זהות והסמכות נבדקים ידנית לפני שמישהו עולה לאוויר." },
            { I: Zap, h: "הזמנה בלי חיכוך", p: "לא צריך חשבון. בוחרים מקצוען, ממלאים פרטים וסיימתם — בפחות משתי דקות." },
            { I: BadgeCheck, h: "תשלום מאובטח בנאמנות", p: "הכרטיס רק מאושר מראש. הכסף מועבר רק אחרי שהעבודה הושלמה." },
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
          <h2 className="text-2xl font-bold sm:text-3xl">המקצוענים המדורגים ביותר</h2>
          <Link to="/search" className="text-sm text-primary hover:underline">לכל המקצוענים ←</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...PROS].sort((a, b) => b.rating - a.rating).slice(0, 8).map((p) => <ProCard key={p.id} pro={p} />)}
        </div>
      </section>
    </>
  );
}
