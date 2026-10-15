import { useEffect } from "react";
import { availableHours, hh, type Pro } from "@/lib/data";
import { todayStr } from "@/lib/store";

/** Date + start/end pickers limited to the pro's available hours. Times are "HH:00". */
export function SlotPicker({
  pro, date, start, end, onChange, labelClass = "text-sm",
}: {
  pro: Pro; date: string; start: string; end: string;
  onChange: (v: { date: string; start: string; end: string }) => void;
  labelClass?: string;
}) {
  const hours = availableHours(pro, date);
  const startH = start ? parseInt(start) : NaN;
  // end options: consecutive available hours after start
  const ends: number[] = [];
  if (hours.includes(startH)) {
    let h = startH;
    while (hours.includes(h)) { ends.push(h + 1); h++; }
  }

  // Keep selection valid when date/availability changes
  useEffect(() => {
    if (!date) return;
    if (!hours.includes(startH)) {
      const s = hours[0];
      onChange({ date, start: s !== undefined ? hh(s) : "", end: s !== undefined ? hh(s + 1) : "" });
    } else if (!ends.includes(parseInt(end))) {
      onChange({ date, start, end: hh(ends[ends.length - 1]!) });
    }
  });

  return (
    <div className="space-y-3">
      <label className={`block ${labelClass}`}>תאריך
        <input type="date" min={todayStr()} className="field mt-1" value={date}
          onChange={(e) => { const v = e.target.value; if (v && v < todayStr()) return; onChange({ date: v, start, end }); }} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>שעת התחלה
          <select className="field time-ltr mt-1" value={hours.includes(startH) ? start : ""} disabled={!date || !hours.length}
            onChange={(e) => onChange({ date, start: e.target.value, end })}>
            {!hours.length && <option value="">—</option>}
            {Array.from({ length: 16 }, (_, i) => i + 7).map((h) => (
              <option key={h} value={hh(h)} disabled={!hours.includes(h)}>{hh(h)}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>שעת סיום
          <select className="field time-ltr mt-1" value={ends.includes(parseInt(end)) ? end : ""} disabled={!ends.length}
            onChange={(e) => onChange({ date, start, end: e.target.value })}>
            {!ends.length && <option value="">—</option>}
            {ends.map((h) => <option key={h} value={hh(h)}>{hh(h)}</option>)}
          </select>
        </label>
      </div>
      {date && !hours.length && <p className="text-xs text-warning">אין שעות פנויות בתאריך הזה. נסו תאריך אחר.</p>}
      {!date && <p className="text-xs text-muted-foreground">בחרו תאריך כדי לראות שעות פנויות.</p>}
    </div>
  );
}
