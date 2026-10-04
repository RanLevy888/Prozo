import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Award, MapPin, Clock, ShieldCheck } from "lucide-react";
import { PROS, calcPrice, professionLabel, hoursBetween } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Stars } from "@/components/site";

export const Route = createFileRoute("/pros/$id")({
  loader: ({ params }) => {
    const pro = PROS.find((p) => p.id === params.id);
    if (!pro) throw notFound();
    return { pro };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Pro not found — Prozo" }, { name: "robots", content: "noindex" }] };
    const { pro } = loaderData;
    const title = `${pro.name} · ${professionLabel(pro.profession)} in ${pro.city} — Prozo`;
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
  notFoundComponent: () => <div className="p-20 text-center">Pro not found. <Link to="/search" className="text-primary">Browse pros</Link></div>,
  component: ProPage,
});

function ProPage() {
  const { pro } = Route.useLoaderData();
  const { lang } = useStore();
  const nav = useNavigate();
  const [date, setDate] = useState("");
  const [start, setStart] = useState("18:00");
  const [end, setEnd] = useState("23:00");
  const hours = Math.max(pro.minHours, hoursBetween(start, end));
  const price = calcPrice(pro.rate, hours);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div className="card-surface flex flex-col gap-6 p-6 sm:flex-row">
          <img src={pro.avatar} alt={pro.name} className="h-32 w-32 rounded-2xl object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{lang === "he" ? pro.nameHe : pro.name}</h1>
              <BadgeCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">{lang === "he" ? pro.name : pro.nameHe}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-accent px-3 py-1">{professionLabel(pro.profession, lang)}</span>
              <Stars value={pro.rating} /><span className="text-muted-foreground">({pro.reviewsCount})</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{pro.city}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />{pro.years} yrs exp.</span>
            </div>
            <p className="mt-4 text-muted-foreground">{pro.bio}</p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Certifications</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {pro.certifications.map((c) => (
              <div key={c} className="card-surface flex items-start gap-3 p-4 text-sm">
                <Award className="h-5 w-5 shrink-0 text-primary" />
                <span>{c}<span className="mt-1 block text-xs text-success">✓ Verified by Prozo</span></span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">{pro.profession === "photographer" ? "Portfolio" : "Gallery"}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {pro.gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />)}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Reviews</h2>
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
          <p className="text-2xl font-bold">₪{pro.rate}<span className="text-sm font-normal text-muted-foreground"> / hour</span></p>
          <p className="text-xs text-muted-foreground">Minimum {pro.minHours} hours</p>
          <div className="mt-5 space-y-3">
            <label className="block text-xs text-muted-foreground">Date<input type="date" className="field mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-muted-foreground">Start<input type="time" className="field mt-1" value={start} onChange={(e) => setStart(e.target.value)} /></label>
              <label className="text-xs text-muted-foreground">End<input type="time" className="field mt-1" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
            </div>
          </div>
          <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">₪{pro.rate} × {hours}h</dt><dd>₪{price.subtotal}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee (10%)</dt><dd>₪{price.fee}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>₪{price.total}</dd></div>
          </dl>
          <button className="btn-primary mt-5 w-full" onClick={() => nav({ to: "/book/$id", params: { id: pro.id }, search: { date, start, end } })}>Book now</button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" />No account needed · Card held in escrow</p>
        </div>
      </aside>
    </div>
  );
}
