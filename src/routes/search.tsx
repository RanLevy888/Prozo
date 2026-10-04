import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { CITIES, PROFESSIONS, PROS } from "@/lib/data";
import { ProCard } from "@/components/site";

type S = { profession?: string | undefined; city?: string | undefined; date?: string | undefined; hours?: number | undefined };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): S => ({
    profession: s['profession'] ? String(s['profession']) : undefined,
    city: s['city'] ? String(s['city']) : undefined,
    date: s['date'] ? String(s['date']) : undefined,
    hours: s['hours'] ? Number(s['hours']) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find event pros — Prozo" },
      { name: "description", content: "Browse verified lifeguards, security guards, medics and photographers near you." },
      { property: "og:title", content: "Find event pros — Prozo" },
      { property: "og:description", content: "Browse verified event professionals and book instantly." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/search" });
  const { lang } = useStore();
  const [sort, setSort] = useState("rating");

  const results = useMemo(() => {
    const r = PROS.filter(
      (p) => (!s['profession'] || p.profession === s['profession']) && (!s['city'] || p.city.toLowerCase().includes(s.city.toLowerCase())),
    );
    return r.sort((a, b) => (sort === "rating" ? b.rating - a.rating : sort === "low" ? a.rate - b.rate : b.rate - a.rate));
  }, [s.profession, s.city, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">{results.length} pros available</h1>
      <p className="mt-1 text-muted-foreground">
        {s['date'] ? `For ${s.date}` : "Any date"} · {s['hours'] ?? 4} hours
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <select className="field w-auto" value={s['profession'] ?? ""} onChange={(e) => nav({ search: (p) => ({ ...p, profession: e.target.value || undefined }) })}>
          <option value="">All professions</option>
          {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p[lang]}</option>)}
        </select>
        <select className="field w-auto" value={s['city'] ?? ""} onChange={(e) => nav({ search: (p) => ({ ...p, city: e.target.value || undefined }) })}>
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c.en} value={c.en}>{c[lang]}</option>)}
        </select>
        <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rating">Top rated</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((p) => <ProCard key={p.id} pro={p} />)}
      </div>
      {results.length === 0 && <p className="mt-16 text-center text-muted-foreground">No pros match these filters yet.</p>}
    </div>
  );
}
