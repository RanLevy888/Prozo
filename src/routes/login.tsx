import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Pro login — Prozo" },
      { name: "description", content: "Log in to manage bookings, availability and documents." },
      { property: "og:title", content: "Pro login — Prozo" },
      { property: "og:description", content: "Access your Prozo pro dashboard." },
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
      <h1 className="text-3xl font-bold">Pro login</h1>
      <p className="mt-2 text-sm text-muted-foreground">Demo: any email + 4+ char password works.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (login(email, password)) nav({ to: "/portal" });
          else toast.error("Incorrect email or password");
        }}
        className="card-surface mt-6 space-y-4 p-6"
      >
        <label className="block text-sm">Email<input required type="email" className="field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm">Password<input required type="password" className="field mt-1" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn-primary w-full">Log in</button>
        <p className="text-center text-sm text-muted-foreground">New here? <Link to="/join" className="text-primary">Join as a Pro</Link></p>
      </form>
    </div>
  );
}
