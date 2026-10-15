import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { he } from "date-fns/locale";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/portal/availability")({
  component: Availability,
});

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00–22:00

function Availability() {
  const { account, updateAccount } = useStore();
  const [week, setWeek] = useState(0);
  if (!account) return null;
  const start = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), week * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const av = account.availability;
  const key = (d: Date, h: number) => `${format(d, "yyyy-MM-dd")}-${h}`;
  const past = (d: Date, h: number) => { const t = new Date(d); t.setHours(h + 1, 0, 0, 0); return t <= new Date(); };
  const toggle = (k: string) => updateAccount({ availability: { ...av, [k]: !av[k] } });
  const setDay = (d: Date, v: boolean) => {
    const n = { ...av };
    HOURS.forEach((h) => { if (!past(d, h)) n[key(d, h)] = v; });
    updateAccount({ availability: n });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">זמינות</h1>
          <p className="text-sm text-muted-foreground">לחצו על משבצת כדי לשנות. כחול = פנוי להזמנות.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost p-2" disabled={week <= 0} onClick={() => setWeek(Math.max(0, week - 1))} aria-label="שבוע קודם"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
          <span className="min-w-36 text-center text-sm">{format(days[0]!, "d בMMM", { locale: he })} – {format(days[6]!, "d בMMM", { locale: he })}</span>
          <button className="btn-ghost p-2" onClick={() => setWeek(week + 1)} aria-label="שבוע הבא"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
        </div>
      </div>
      <div className="card-surface mt-6 overflow-x-auto p-4">
        <div className="grid min-w-[640px] grid-cols-[50px_repeat(7,1fr)] gap-1">
          <div />
          {days.map((d) => (
            <div key={d.toISOString()} className="pb-2 text-center text-xs">
              <p className="text-muted-foreground">{format(d, "EEEE", { locale: he })}</p>
              <p className="font-semibold">{format(d, "d")}</p>
              <div className="mt-1 flex justify-center gap-1">
                <button className="text-[10px] text-primary hover:underline" onClick={() => setDay(d, true)}>הכול</button>
                <button className="text-[10px] text-muted-foreground hover:underline" onClick={() => setDay(d, false)}>חסימה</button>
              </div>
            </div>
          ))}
          {HOURS.map((h) => (
            <div key={h} className="contents">
              <div className="time-ltr pe-2 text-end text-[11px] leading-7 text-muted-foreground">{String(h).padStart(2, "0")}:00</div>
              {days.map((d) => {
                const k = key(d, h);
                const p = past(d, h);
                return (
                  <button key={k} disabled={p} onClick={() => toggle(k)} aria-pressed={!!av[k]}
                    className={`h-7 rounded-md border transition ${p ? "cursor-not-allowed opacity-25" : av[k] ? "border-primary bg-gradient-primary" : "bg-secondary hover:bg-accent"}`} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{Object.values(av).filter(Boolean).length} שעות מסומנות כפנויות</p>
    </div>
  );
}
