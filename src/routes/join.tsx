import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { PROFESSIONS, type Profession } from "@/lib/data";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "הצטרפות כמקצוען — Prozo" },
      { name: "description", content: "אנשי מקצוע מכל התחומים — קבלו הזמנות עבודה באזורכם." },
      { property: "og:title", content: "הצטרפות כמקצוען — Prozo" },
      { property: "og:description", content: "קובעים מחיר, אזור שירות ולוח זמנים. מקבלים תשלום מאובטח." },
    ],
  }),
  component: Join,
});

function Join() {
  const { register } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "", profession: "lifeguard" as Profession, rate: 130, minHours: 4, radius: 25 });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.type === "number" || e.target.type === "range" ? +e.target.value : e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 6) { toast.error("הסיסמה חייבת להכיל לפחות 6 תווים"); return; }
    register({ ...f, docs: { id: "missing", cert: "missing", firstaid: "missing" }, availability: {} });
    toast.success("ברוכים הבאים ל-Prozo! העלו מסמכים כדי לעלות לאוויר.");
    nav({ to: "/portal/documents" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">הצטרפו כמקצוענים ל-Prozo</h1>
      <p className="mt-2 text-muted-foreground">כבר רשומים? <Link to="/login" className="text-primary">להתחברות</Link></p>
      <form onSubmit={submit} className="card-surface mt-8 grid gap-4 p-6 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">שם מלא<input required className="field mt-1" value={f.name} onChange={set("name")} /></label>
        <label className="text-sm">טלפון נייד<input required type="tel" dir="ltr" className="field mt-1 text-end" value={f.phone} onChange={set("phone")} /></label>
        <label className="text-sm">אימייל<input required type="email" dir="ltr" className="field mt-1 text-end" value={f.email} onChange={set("email")} /></label>
        <label className="text-sm sm:col-span-2">סיסמה<input required type="password" className="field mt-1" value={f.password} onChange={set("password")} /></label>
        <label className="text-sm sm:col-span-2">מקצוע
          <select className="field mt-1" value={f.profession} onChange={set("profession")}>
            {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </label>
        <label className="text-sm">תעריף לשעה (₪)<input type="number" min={50} className="field mt-1" value={f.rate} onChange={set("rate")} /></label>
        <label className="text-sm">מינימום שעות<input type="number" min={1} className="field mt-1" value={f.minHours} onChange={set("minHours")} /></label>
        <label className="text-sm sm:col-span-2">רדיוס שירות: <b>{f.radius} ק״מ</b>
          <input type="range" min={5} max={100} step={5} className="mt-2 w-full accent-primary" value={f.radius} onChange={set("radius")} />
        </label>
        <button className="btn-primary sm:col-span-2">יצירת חשבון מקצוען</button>
      </form>
    </div>
  );
}
