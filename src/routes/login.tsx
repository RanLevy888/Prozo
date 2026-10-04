import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "כניסת מקצוענים — Prozo" },
      { name: "description", content: "התחברו לניהול הזמנות, זמינות ומסמכים." },
      { property: "og:title", content: "כניסת מקצוענים — Prozo" },
      { property: "og:description", content: "גישה ללוח הבקרה של המקצוענים ב-Prozo." },
    ],
  }),
  component: Login,
});

function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">כניסת מקצוענים</h1>
      <p className="mt-2 text-sm text-muted-foreground">גרסת הדגמה: כל אימייל עם סיסמה של 4 תווים ומעלה.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (login(email, password)) nav({ to: "/portal" });
          else toast.error("אימייל או סיסמה שגויים");
        }}
        className="card-surface mt-6 space-y-4 p-6"
      >
        <label className="block text-sm">אימייל<input required type="email" dir="ltr" className="field mt-1 text-end" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm">סיסמה<input required type="password" className="field mt-1" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn-primary w-full">התחברות</button>
        <p className="text-center text-sm text-muted-foreground">חדשים כאן? <Link to="/join" className="text-primary">הצטרפו כמקצוענים</Link></p>
      </form>
    </div>
  );
}
