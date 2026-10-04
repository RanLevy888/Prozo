import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { PROFESSIONS, type Profession } from "@/lib/data";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Prozo as a certified pro" },
      { name: "description", content: "Lifeguards, security guards, medics and photographers — get booked for events near you." },
      { property: "og:title", content: "Join Prozo as a certified pro" },
      { property: "og:description", content: "Set your rate, your radius and your schedule. Get paid securely." },
    ],
  }),
  component: Join,
});

function Join() {
  const { register, lang } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "", profession: "lifeguard" as Profession, rate: 130, minHours: 4, radius: 25 });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.type === "number" || e.target.type === "range" ? +e.target.value : e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 6) return toast.error("Password must be at least 6 characters");
    register({ ...f, docs: { id: "missing", cert: "missing", firstaid: "missing" }, availability: {} });
    toast.success("Welcome to Prozo! Upload your documents to go live.");
    nav({ to: "/portal/documents" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Become a Prozo pro</h1>
      <p className="mt-2 text-muted-foreground">Already registered? <Link to="/login" className="text-primary">Log in</Link></p>
      <form onSubmit={submit} className="card-surface mt-8 grid gap-4 p-6 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">Full name<input required className="field mt-1" value={f.name} onChange={set("name")} /></label>
        <label className="text-sm">Phone<input required type="tel" className="field mt-1" value={f.phone} onChange={set("phone")} /></label>
        <label className="text-sm">Email<input required type="email" className="field mt-1" value={f.email} onChange={set("email")} /></label>
        <label className="text-sm sm:col-span-2">Password<input required type="password" className="field mt-1" value={f.password} onChange={set("password")} /></label>
        <label className="text-sm sm:col-span-2">Profession
          <select className="field mt-1" value={f.profession} onChange={set("profession")}>
            {PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p[lang]}</option>)}
          </select>
        </label>
        <label className="text-sm">Hourly rate (₪)<input type="number" min={50} className="field mt-1" value={f.rate} onChange={set("rate")} /></label>
        <label className="text-sm">Minimum hours<input type="number" min={1} className="field mt-1" value={f.minHours} onChange={set("minHours")} /></label>
        <label className="text-sm sm:col-span-2">Service radius: <b>{f.radius} km</b>
          <input type="range" min={5} max={100} step={5} className="mt-2 w-full accent-primary" value={f.radius} onChange={set("radius")} />
        </label>
        <button className="btn-primary sm:col-span-2">Create pro account</button>
      </form>
    </div>
  );
}
