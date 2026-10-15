import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Award, MapPin, Clock, ShieldCheck } from "lucide-react";
import { PROS, calcPrice, professionLabel, hoursBetween } from "@/lib/data";
import { Stars } from "@/components/site";
import { SlotPicker } from "@/components/slots";
import { useStore, isPast } from "@/lib/store";

export const Route = createFileRoute("/pros/$id")({
  loader: ({ params }) => {
    return { pro: PROS.find((p) => p.id === params.id) ?? null };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.pro) return { meta: [{ title: "פרופיל איש מקצוע — Prozo" }, { name: "description", content: "פרופיל איש מקצוע מאומת ב-Prozo." }, { property: "og:title", content: "פרופיל איש מקצוע — Prozo" }, { property: "og:description", content: "פרופיל איש מקצוע מאומת ב-Prozo." }] };
    const { pro } = loaderData;
    const title = `${pro.name} · ${professionLabel(pro.profession)} ב${pro.city} — Prozo`;
    return {
      meta: [
        { title },
        { name: "description", content: pro.bio },
        { property: "og:title", content: title },
        { property: "og:description", content: pro.bio },
        { property: "og:image", content: pro.avatar },
        { name: "twitter:image", content: pro.avatar },
      ],
    };
  },
  component: ProPage,
});

function ProPage() {
  const { id } = Route.useParams();
  const { pros, hydrated } = useStore();
  const pro = pros.find((p) => p.id === id);
  if (!pro) return hydrated ? <div className="p-20 text-center">איש המקצוע לא נמצא. <Link to="/search" className="text-primary">חזרה לחיפוש</Link></div> : <div className="p-20 text-center text-muted-foreground">טוען…</div>;
  return <ProView pro={pro} />;
}

function ProView({ pro }: { pro: import("@/lib/data").Pro }) {
  const nav = useNavigate();
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const bookable = pro.availableNow && pro.verified !== false;
  const hours = Math.max(pro.minHours, hoursBetween(start, end));
  const price = calcPrice(pro.rate, hours);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div className="card-surface flex flex-col gap-6 p-6 sm:flex-row">
          <img src={pro.avatar} alt={pro.name} className="h-32 w-32 rounded-2xl object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{pro.name}</h1>
              {pro.verified === false ? <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs text-warning">ממתין לאימות</span> : <BadgeCheck className="h-6 w-6 text-primary" aria-label="מאומת" />}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-accent px-3 py-1">{professionLabel(pro.profession)}</span>
              <Stars value={pro.rating} /><span className="text-muted-foreground">({pro.reviewsCount} ביקורות)</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{pro.city}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />{pro.years} שנות ניסיון</span>
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{pro.bio}</p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-semibold">הסמכות ורישיונות</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {pro.certifications.map((c) => (
              <div key={c} className="card-surface flex items-start gap-3 p-4 text-sm">
                <Award className="h-5 w-5 shrink-0 text-primary" />
                <span>{c}<span className="mt-1 block text-xs text-success">✓ אומת על ידי Prozo</span></span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">{"תיק עבודות"}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {pro.gallery.map((g, i) => (
              <figure key={g}>
                <img src={g} alt={`עבודה ${i + 1} של ${pro.name}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
                <figcaption className="mt-1 text-xs text-muted-foreground">{pro.profession === "photographer" ? `מתוך אירוע ${i + 1}` : `עבודה ${i + 1}`}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">ביקורות</h2>
          <div className="space-y-3">
            {pro.reviews.map((r, i) => (
              <div key={i} className="card-surface p-4">
                <div className="flex justify-between text-sm"><b>{r.author}</b><Stars value={r.rating} /></div>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card-surface p-6 shadow-glow">
          <p className="text-2xl font-bold">₪{pro.rate}<span className="text-sm font-normal text-muted-foreground"> / לשעה</span></p>
          <p className="text-xs text-muted-foreground">מינימום {pro.minHours} שעות</p>
          <div className="mt-5">
            <SlotPicker pro={pro} date={date} start={start} end={end} labelClass="text-xs text-muted-foreground"
              onChange={(v) => { setDate(v.date); setStart(v.start); setEnd(v.end); }} />
          </div>
          <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">₪{pro.rate} × {hours} שעות</dt><dd>₪{price.subtotal}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">דמי שירות</dt><dd>₪{price.fee}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>סה״כ</dt><dd>₪{price.total}</dd></div>
          </dl>
          {isPast(date, start) && <p className="mt-3 text-xs text-destructive">לא ניתן לבחור תאריך או שעה שכבר עברו.</p>}
          {pro.verified === false && <p className="mt-3 text-xs text-warning">הפרופיל ממתין לאימות מסמכים ועדיין לא ניתן להזמין אותו.</p>}
          {pro.verified !== false && !pro.availableNow && <p className="mt-3 text-xs text-warning">איש המקצוע לא זמין כרגע להזמנות.</p>}
          <button className="btn-primary mt-5 w-full" disabled={!bookable || !date || !start || !end || isPast(date, start)} onClick={() => nav({ to: "/book/$id", params: { id: pro.id }, search: { date: date || undefined, start, end } })}>להזמנה</button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" />ללא צורך בחשבון · התשלום מוחזק בנאמנות</p>
        </div>
      </aside>
    </div>
  );
}
