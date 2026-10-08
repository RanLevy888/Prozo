import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { CITIES, PROFESSIONS, PROS, cityMatches, professionLabel } from "@/lib/data";
import { ProCard } from "@/components/site";

type S = { profession?: string | undefined; city?: string | undefined; date?: string | undefined; hours?: number | undefined };

const str = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : String(v));

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): S => {
    const h = Number(s["hours"]);
    return {
      profession: str(s["profession"]),
      city: str(s["city"]),
      date: str(s["date"]),
      hours: Number.isFinite(h) && h > 0 ? h : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "חיפוש אנשי מקצוע — Prozo" },
      { name: "description", content: "אנשי מקצוע מאומתים באזורכם, זמינים להזמנה מיידית." },
      { property: "og:title", content: "חיפוש אנשי מקצוע — Prozo" },
      { property: "og:description", content: "השוו והזמינו אנשי מקצוע מוסמכים." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/search" });
  const [sort, setSort] = useState("rating");

  const results = useMemo(() => {
    const r = PROS.filter((p) => (!s.profession || p.profession === s.profession) && cityMatches(p.city, s.city));
    return r.sort((a, b) => (sort === "rating" ? b.rating - a.rating : sort === "low" ? a.rate - b.rate : b.rate - a.rate));
  }, [s.profession, s.city, sort]);

  const reset = () => nav({ search: { date: s.date, hours: s.hours } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">
        {results.length > 0 ? `${results.length} מקצוענים זמינים` : "לא נמצאו מקצוענים"}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {s.profession ? professionLabel(s.profession) : "כל המקצועות"}
        {s.city ? ` · ${s.city}` : ""} · {s.date ? `בתאריך ${s.date}` : "כל תאריך"} · {s.hours ?? 4} שעות
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <select className="field w-auto" value={s.profession ?? ""} onChange={(e) => nav({ search: (p) => ({ ...p, profession: e.target.value || undefined }) })}>
          <option value="">כל המקצועות</option>
          {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <select className="field w-auto" value={CITIES.some((c) => c.he === s.city) ? s.city : ""} onChange={(e) => nav({ search: (p) => ({ ...p, city: e.target.value || undefined }) })}>
          <option value="">כל הערים</option>
          {CITIES.map((c) => <option key={c.he} value={c.he}>{c.he}</option>)}
        </select>
        <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rating">דירוג גבוה</option>
          <option value="low">מחיר: מהנמוך לגבוה</option>
          <option value="high">מחיר: מהגבוה לנמוך</option>
        </select>
      </div>

      {results.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => <ProCard key={p.id} pro={p} />)}
        </div>
      ) : (
        <div className="card-surface mx-auto mt-12 max-w-md p-10 text-center">
          <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">אופס, אין התאמות כרגע</h2>
          <p className="mt-2 text-sm text-muted-foreground">לא מצאנו מקצוענים שמתאימים לסינון שבחרתם. נסו עיר אחרת או אפסו את המסננים.</p>
          <button className="btn-primary mt-6" onClick={reset}>איפוס מסננים</button>
        </div>
      )}
    </div>
  );
}
