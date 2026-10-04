import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const toggle = (k: string) => updateAccount({ availability: { ...av, [k]: !av[k] } });
  const setDay = (d: Date, v: boolean) => {
    const n = { ...av };
    HOURS.forEach((h) => (n[key(d, h)] = v));
    updateAccount({ availability: n });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Availability</h1>
          <p className="text-sm text-muted-foreground">Tap slots to toggle. Blue = available for bookings.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost p-2" onClick={() => setWeek(week - 1)} aria-label="Previous week"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
          <span className="min-w-36 text-center text-sm">{format(days[0]!, "MMM d")} – {format(days[6]!, "MMM d")}</span>
          <button className="btn-ghost p-2" onClick={() => setWeek(week + 1)} aria-label="Next week"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
        </div>
      </div>
      <div className="card-surface mt-6 overflow-x-auto p-4">
        <div className="grid min-w-[640px] grid-cols-[50px_repeat(7,1fr)] gap-1">
          <div />
          {days.map((d) => (
            <div key={d.toISOString()} className="pb-2 text-center text-xs">
              <p className="text-muted-foreground">{format(d, "EEE")}</p>
              <p className="font-semibold">{format(d, "d")}</p>
              <div className="mt-1 flex justify-center gap-1">
                <button className="text-[10px] text-primary hover:underline" onClick={() => setDay(d, true)}>All</button>
                <button className="text-[10px] text-muted-foreground hover:underline" onClick={() => setDay(d, false)}>Block</button>
              </div>
            </div>
          ))}
          {HOURS.map((h) => (
            <div key={h} className="contents">
              <div className="pe-2 text-end text-[11px] leading-7 text-muted-foreground">{String(h).padStart(2, "0")}:00</div>
              {days.map((d) => {
                const k = key(d, h);
                return (
                  <button key={k} onClick={() => toggle(k)} aria-pressed={!!av[k]}
                    className={`h-7 rounded-md border transition ${av[k] ? "border-primary bg-gradient-primary" : "bg-secondary hover:bg-accent"}`} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{Object.values(av).filter(Boolean).length} hours marked available</p>
    </div>
  );
}
