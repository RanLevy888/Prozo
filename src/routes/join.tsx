import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { AvatarInput, avatarError } from "@/components/avatar-input";
import { CITIES, PROFESSIONS, type Profession } from "@/lib/data";

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

type Form = { name: string; phone: string; email: string; password: string; profession: Profession; city: string; rate: number; minHours: number; radius: number; avatar: string };
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  const name = f.name.trim();
  if (!name) e.name = "יש להזין שם מלא";
  else if (name.length < 2 || name.length > 80) e.name = "השם צריך להכיל בין 2 ל-80 תווים";
  else if (name.includes("@") || !/\s/.test(name)) e.name = "יש להזין שם פרטי ושם משפחה";
  const av = avatarError(f.avatar);
  if (av) e.avatar = av;
  const phone = f.phone.replace(/[\s-]/g, "");
  if (!phone) e.phone = "יש להזין מספר טלפון";
  else if (!/^0\d{8,9}$/.test(phone)) e.phone = "מספר הטלפון אינו תקין (לדוגמה: 050-1234567)";
  const email = f.email.trim();
  if (!email) e.email = "יש להזין כתובת אימייל";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 255) e.email = "כתובת האימייל אינה תקינה";
  if (!f.password) e.password = "יש להזין סיסמה";
  else if (f.password.length < 6) e.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
  if (!f.city) e.city = "יש לבחור עיר";
  if (!(f.rate >= 30 && f.rate <= 5000)) e.rate = "התעריף צריך להיות בין ₪30 ל-₪5,000";
  if (!(f.minHours >= 1 && f.minHours <= 24)) e.minHours = "מינימום השעות צריך להיות בין 1 ל-24";
  return e;
}

function Field({ label, error, className = "", children }: { label: string; error?: string | undefined; className?: string; children: ReactNode }) {
  return (
    <label className={`text-sm ${className}`}>
      {label}
      {children}
      {error && <span role="alert" className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Join() {
  const { register } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState<Form>({ name: "", phone: "", email: "", password: "", profession: "lifeguard", city: CITIES[0]!.he, rate: 130, minHours: 4, radius: 25, avatar: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...f, [k]: e.target.type === "number" || e.target.type === "range" ? +e.target.value : e.target.value };
    setF(next);
    if (tried) setErrors(validate(next));
  };
  const cls = (k: keyof Form) => `field mt-1 ${errors[k] ? "border-destructive" : ""}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    register({ ...f, name: f.name.trim(), email: f.email.trim() });
    toast.success("ברוכים הבאים ל-Prozo! העלו מסמכים כדי שנאשר את הפרופיל ותוכלו לקבל הזמנות.");
    nav({ to: "/portal" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">הצטרפו כמקצוענים ל-Prozo</h1>
      <p className="mt-2 text-muted-foreground">כבר רשומים? <Link to="/login" className="text-primary">להתחברות</Link></p>
      <form noValidate onSubmit={submit} className="card-surface mt-8 grid gap-4 p-6 sm:grid-cols-2">
        <Field label="שם מלא" error={errors.name} className="sm:col-span-2"><input className={cls("name")} maxLength={80} value={f.name} onChange={set("name")} /></Field>
        <div className="text-sm sm:col-span-2">תמונת פרופיל<div className="mt-2"><AvatarInput value={f.avatar} onChange={(v) => { const n = { ...f, avatar: v }; setF(n); if (tried) setErrors(validate(n)); }} error={errors.avatar} /></div></div>
        <Field label="טלפון נייד" error={errors.phone}><input type="tel" dir="ltr" className={`${cls("phone")} text-end`} placeholder="050-1234567" value={f.phone} onChange={set("phone")} /></Field>
        <Field label="אימייל" error={errors.email}><input type="email" dir="ltr" className={`${cls("email")} text-end`} maxLength={255} value={f.email} onChange={set("email")} /></Field>
        <Field label="סיסמה" error={errors.password} className="sm:col-span-2"><input type="password" className={cls("password")} value={f.password} onChange={set("password")} /></Field>
        <Field label="מקצוע">
          <select className={cls("profession")} value={f.profession} onChange={set("profession")}>
            {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="עיר" error={errors.city}>
          <select className={cls("city")} value={f.city} onChange={set("city")}>
            {CITIES.map((c) => <option key={c.he} value={c.he}>{c.he}</option>)}
          </select>
        </Field>
        <Field label="תעריף לשעה (₪)" error={errors.rate}><input type="number" className={cls("rate")} value={f.rate} onChange={set("rate")} /></Field>
        <Field label="מינימום שעות" error={errors.minHours}><input type="number" className={cls("minHours")} value={f.minHours} onChange={set("minHours")} /></Field>
        <label className="text-sm sm:col-span-2">רדיוס שירות: <b>{f.radius} ק״מ</b>
          <input type="range" min={5} max={100} step={5} className="mt-2 w-full accent-primary" value={f.radius} onChange={set("radius")} />
        </label>
        <button className="btn-primary sm:col-span-2">יצירת חשבון מקצוען</button>
      </form>
    </div>
  );
}
