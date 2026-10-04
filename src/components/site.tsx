import { Link } from "@tanstack/react-router";
import { BadgeCheck, Languages, ShieldCheck, Star, MapPin } from "lucide-react";
import { useStore, useT } from "@/lib/store";
import { professionLabel, type Pro } from "@/lib/data";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow">
        <ShieldCheck className="h-4.5 w-4.5" />
      </span>
      Prozo
    </Link>
  );
}

export function Navbar() {
  const t = useT();
  const { lang, setLang, loggedIn } = useStore();
  return (
    <header className="sticky top-0 z-40 glass border-x-0 border-t-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setLang(lang === "en" ? "he" : "en")} className="btn-ghost px-2.5 py-1.5 text-sm" aria-label="Toggle language">
            <Languages className="h-4 w-4" /> {lang === "en" ? "עב" : "EN"}
          </button>
          <Link to="/join" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">{t.join}</Link>
          <Link to={loggedIn ? "/portal" : "/login"} className="btn-primary px-4 py-2 text-sm">
            {loggedIn ? t.dashboard : t.login}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <Logo />
        <p>© 2026 Prozo. Certified event professionals on demand.</p>
      </div>
    </footer>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="h-4 w-4 fill-warning text-warning" />
      <b>{value.toFixed(1)}</b>
    </span>
  );
}

export function ProCard({ pro }: { pro: Pro }) {
  const { lang } = useStore();
  return (
    <Link to="/pros/$id" params={{ id: pro.id }} className="group card-surface flex flex-col p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <div className="flex items-start gap-4">
        <img src={pro.avatar} alt={pro.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold">{lang === "he" ? pro.nameHe : pro.name}</h3>
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
          </div>
          <span className="mt-1 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">{professionLabel(pro.profession, lang)}</span>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{pro.city}</span>
            <span>{pro.reviewsCount} reviews</span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <Stars value={pro.rating} />
        <span className="text-lg font-bold">₪{pro.rate}<span className="text-xs font-normal text-muted-foreground">/hr</span></span>
      </div>
    </Link>
  );
}
