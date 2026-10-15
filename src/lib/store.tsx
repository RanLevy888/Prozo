import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PROS, CITIES, type Pro, type Profession } from "./data";

export interface Booking {
  code: string;
  proId: string;
  date: string;
  start: string;
  end: string;
  hours: number;
  location: string;
  clientName: string;
  phone: string;
  email: string;
  total: number;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}
export interface ProAccount {
  proId: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  profession: Profession;
  city: string;
  rate: number;
  minHours: number;
  radius: number;
  avatar?: string;
  docs: Record<string, DocStatus>;
  availability: Record<string, boolean>;
  status?: AccountStatus;
}
export type DocStatus = "missing" | "pending" | "approved" | "rejected";
export type AccountStatus = "incomplete" | "pending_approval" | "approved" | "rejected";
export const accountStatus = (a: ProAccount): AccountStatus => a.status ?? "incomplete";

interface Store {
  hydrated: boolean;
  pros: Pro[];
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  setBookingStatus: (code: string, s: Booking["status"]) => void;
  account: ProAccount | null;
  loggedIn: boolean;
  register: (a: Omit<ProAccount, "proId" | "docs" | "availability" | "status">) => void;
  accounts: ProAccount[];
  /** Admin: approve/reject an account's documents. */
  reviewAccount: (email: string, approve: boolean) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateAccount: (p: Partial<ProAccount>) => void;
  setAvailableNow: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setV(JSON.parse(s));
    } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(v));
  }, [key, v, ready]);
  return [v, setV, ready] as const;
}

const BIO_NEW = "איש/אשת מקצוע חדש/ה ב-Prozo. הפרופיל המלא יתעדכן בקרוב.";

function proFromAccount(a: ProAccount, availableNow: boolean): Pro {
  return {
    id: a.proId,
    name: a.name,
    profession: a.profession,
    city: a.city,
    rate: a.rate,
    minHours: a.minHours,
    rating: 0,
    reviewsCount: 0,
    avatar: a.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(a.name)}&backgroundColor=3b5bdb`,
    bio: BIO_NEW,
    certifications: [],
    gallery: [],
    reviews: [],
    years: 0,
    availableNow,
    isNew: true,
    verified: accountStatus(a) === "approved",
    availability: a.availability,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings, r1] = useLS<Booking[]>("prozo-bookings-v2", []);
  const [accounts, setAccounts, r2] = useLS<ProAccount[]>("prozo-accounts-v2", []);
  const [activeEmail, setActiveEmail, r3] = useLS<string | null>("prozo-active-v2", null);
  const [availNow, setAvailNow, r4] = useLS<Record<string, boolean>>("prozo-available-now-v2", {});
  const hydrated = r1 && r2 && r3 && r4;

  const account = accounts.find((a) => a.email === activeEmail) ?? null;

  const pros = useMemo(
    () => [
      ...accounts.map((a) => proFromAccount(a, availNow[a.proId] ?? true)),
      ...PROS.map((p) => ({ ...p, availableNow: availNow[p.id] ?? p.availableNow })),
    ],
    [accounts, availNow],
  );

  const value: Store = {
    hydrated,
    pros,
    bookings,
    addBooking: (b) => setBookings((p) => [b, ...p]),
    setBookingStatus: (code, s) => setBookings((p) => p.map((b) => (b.code === code ? { ...b, status: s } : b))),
    account,
    accounts,
    reviewAccount: (email, approve) => setAccounts((all) => all.map((a) => a.email !== email ? a : {
      ...a,
      status: approve ? "approved" : "rejected",
      docs: Object.fromEntries(Object.entries(a.docs).map(([k, v]) => [k, v === "missing" ? v : approve ? "approved" : "rejected"])),
    })),
    loggedIn: !!account,
    register: (a) => {
      const email = a.email.trim().toLowerCase();
      const acc: ProAccount = {
        ...a,
        email,
        proId: `new-${Date.now().toString(36)}`,
        docs: { id: "missing", cert: "missing", firstaid: "missing" },
        availability: {},
        status: "incomplete",
      };
      setAccounts((p) => [...p.filter((x) => x.email !== email), acc]);
      setActiveEmail(email);
    },
    login: (email, password) => {
      const e = email.trim().toLowerCase();
      const acc = accounts.find((a) => a.email === e && a.password === password);
      if (!acc) return false;
      setActiveEmail(e);
      return true;
    },
    logout: () => setActiveEmail(null),
    updateAccount: (p) => setAccounts((all) => all.map((a) => (a.email === activeEmail ? { ...a, ...p } : a))),
    setAvailableNow: (v) => { if (account) setAvailNow((m) => ({ ...m, [account.proId]: v })); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
};

export const DEFAULT_CITY = CITIES[0]!.he;

/** Local "today" as yyyy-MM-dd and current "HH:mm". */
export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const nowTimeStr = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
/** True when date/time is in the past relative to now. */
export const isPast = (date: string, time?: string) => {
  if (!date) return false;
  const t = todayStr();
  if (date < t) return true;
  if (date === t && time) return time < nowTimeStr();
  return false;
};
