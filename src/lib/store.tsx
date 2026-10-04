import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Profession } from "./data";

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
  name: string;
  phone: string;
  email: string;
  password: string;
  profession: Profession;
  rate: number;
  minHours: number;
  radius: number;
  docs: Record<string, "missing" | "pending" | "approved">;
  availability: Record<string, boolean>;
}

interface Store {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  setBookingStatus: (code: string, s: Booking["status"]) => void;
  account: ProAccount | null;
  loggedIn: boolean;
  register: (a: ProAccount) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateAccount: (p: Partial<ProAccount>) => void;
}

const Ctx = createContext<Store | null>(null);

const seedBookings: Booking[] = [
  { code: "PZ-48KQ2", proId: "pro-1", date: "2026-10-12", start: "14:00", end: "20:00", hours: 6, location: "וילה, כפר שמריהו", clientName: "דנה רוזן", phone: "052-555-1212", email: "dana@example.com", total: 924, status: "pending", createdAt: "2026-10-03" },
  { code: "PZ-91TX7", proId: "pro-1", date: "2026-10-18", start: "10:00", end: "16:00", hours: 6, location: "בריכת מלון הילטון, תל אביב", clientName: "יוסי קליין", phone: "054-333-9090", email: "yossi@example.com", total: 924, status: "pending", createdAt: "2026-10-02" },
  { code: "PZ-22MN4", proId: "pro-1", date: "2026-10-09", start: "12:00", end: "18:00", hours: 6, location: "מרינה הרצליה", clientName: "הילה מור", phone: "050-777-1111", email: "hila@example.com", total: 924, status: "accepted", createdAt: "2026-09-28" },
  { code: "PZ-73LP0", proId: "pro-1", date: "2026-10-25", start: "15:00", end: "21:00", hours: 6, location: "אחוזה פרטית, סביון", clientName: "עמית סגל", phone: "053-222-4545", email: "amit@example.com", total: 924, status: "accepted", createdAt: "2026-09-30" },
];

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
  return [v, setV] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useLS<Booking[]>("prozo-bookings-he", seedBookings);
  const [account, setAccount] = useLS<ProAccount | null>("prozo-account-he", null);
  const [loggedIn, setLoggedIn] = useLS<boolean>("prozo-auth", false);

  const value: Store = {
    bookings,
    addBooking: (b) => setBookings((p) => [b, ...p]),
    setBookingStatus: (code, s) => setBookings((p) => p.map((b) => (b.code === code ? { ...b, status: s } : b))),
    account,
    loggedIn,
    register: (a) => { setAccount(a); setLoggedIn(true); },
    login: (email, password) => {
      if (account && account.email === email && account.password === password) { setLoggedIn(true); return true; }
      if (!account && email && password.length >= 4) {
        setAccount({ name: "נועה לוי", phone: "052-000-0000", email, password, profession: "lifeguard", rate: 140, minHours: 4, radius: 25, docs: { id: "approved", cert: "approved", firstaid: "pending" }, availability: {} });
        setLoggedIn(true);
        return true;
      }
      return false;
    },
    logout: () => setLoggedIn(false),
    updateAccount: (p) => setAccount((a) => (a ? { ...a, ...p } : a)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
};
