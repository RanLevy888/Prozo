export type Profession = "lifeguard" | "security" | "medic" | "photographer";

export const PROFESSIONS: { id: Profession; en: string; he: string }[] = [
  { id: "lifeguard", en: "Pool Lifeguard", he: "מציל בריכה" },
  { id: "security", en: "Security / Bouncer", he: "מאבטח / סלקטור" },
  { id: "medic", en: "Medic / First Aid", he: "חובש / עזרה ראשונה" },
  { id: "photographer", en: "Event Photographer", he: "צלם אירועים" },
];

export const CITIES = [
  { en: "Tel Aviv", he: "תל אביב" },
  { en: "Herzliya", he: "הרצליה" },
  { en: "Haifa", he: "חיפה" },
  { en: "Rishon LeZion", he: "ראשון לציון" },
  { en: "Jerusalem", he: "ירושלים" },
];

export interface Review { author: string; rating: number; text: string; date: string }
export interface Pro {
  id: string;
  name: string;
  nameHe: string;
  profession: Profession;
  city: string;
  rate: number;
  minHours: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  bio: string;
  certifications: string[];
  gallery: string[];
  reviews: Review[];
  years: number;
}

const certs: Record<Profession, string[]> = {
  lifeguard: ["Pool Lifeguard License – Ministry of Culture & Sport", "CPR & AED Certified (2025)", "First Aid Refresher"],
  security: ["Armed Security License – Ministry of Public Security", "Crowd Management Certification", "Basic First Aid"],
  medic: ["MDA Certified Medic", "BLS / ACLS Provider", "Mass Casualty Event Training"],
  photographer: ["Professional Photography Diploma – Bezalel", "Drone Operator License (CAA)", "Adobe Certified Professional"],
};

const bios: Record<Profession, string> = {
  lifeguard: "Certified pool lifeguard with extensive experience at private villa parties, hotel pools and corporate summer events. Calm, vigilant and focused on guest safety.",
  security: "Former IDF combat soldier and licensed security professional. Specializes in door control, VIP protection and crowd flow at private and corporate events.",
  medic: "Experienced first responder providing on-site medical coverage for festivals, weddings and sport events. Fully equipped with trauma and AED kit.",
  photographer: "Event photographer capturing candid, cinematic moments at weddings, bar mitzvahs and brand activations. Fast delivery with edited gallery within 72h.",
};

const raw: [string, string, Profession, number, number, string][] = [
  ["Noa Levi", "נועה לוי", "lifeguard", 0, 140, "women/44"],
  ["Itay Cohen", "איתי כהן", "lifeguard", 1, 130, "men/32"],
  ["Yael Mizrahi", "יעל מזרחי", "lifeguard", 3, 125, "women/65"],
  ["Omer Peretz", "עומר פרץ", "lifeguard", 2, 120, "men/45"],
  ["Avi Biton", "אבי ביטון", "security", 0, 110, "men/75"],
  ["Daniel Friedman", "דניאל פרידמן", "security", 4, 115, "men/11"],
  ["Shira Azulay", "שירה אזולאי", "security", 1, 120, "women/22"],
  ["Eitan Shapiro", "איתן שפירא", "security", 2, 105, "men/52"],
  ["Tamar Ben-David", "תמר בן דוד", "medic", 0, 160, "women/33"],
  ["Yonatan Katz", "יונתן כץ", "medic", 4, 150, "men/86"],
  ["Michal Dahan", "מיכל דהן", "medic", 3, 155, "women/90"],
  ["Ron Avraham", "רון אברהם", "medic", 2, 145, "men/22"],
  ["Maya Goldberg", "מאיה גולדברג", "photographer", 0, 320, "women/68"],
  ["Lior Halevi", "ליאור הלוי", "photographer", 1, 280, "men/67"],
  ["Gal Ohana", "גל אוחנה", "photographer", 4, 300, "women/12"],
  ["Ariel Sasson", "אריאל ששון", "photographer", 3, 260, "men/36"],
];

const reviewPool = [
  { author: "Dana R.", text: "Super professional and punctual. Our guests felt safe the entire night." },
  { author: "Yossi K.", text: "Booked in 2 minutes, arrived early, excellent attitude. Highly recommended!" },
  { author: "Hila M.", text: "Exactly what we needed for our event. Will definitely book again." },
  { author: "Amit S.", text: "Very polite, discreet and alert. Great communication before the event." },
];

export const PROS: Pro[] = raw.map(([name, nameHe, profession, cityIdx, rate, img], i) => ({
  id: `pro-${i + 1}`,
  name,
  nameHe,
  profession,
  city: CITIES[cityIdx].en,
  rate,
  minHours: profession === "photographer" ? 3 : 4,
  rating: Math.round((4.6 + ((i * 7) % 5) / 12) * 10) / 10,
  reviewsCount: 18 + ((i * 13) % 90),
  avatar: `https://randomuser.me/api/portraits/${img}.jpg`,
  bio: bios[profession],
  certifications: certs[profession],
  years: 2 + (i % 9),
  gallery:
    profession === "photographer"
      ? Array.from({ length: 6 }, (_, g) => `https://picsum.photos/seed/prozo-${i}-${g}/600/450`)
      : Array.from({ length: 3 }, (_, g) => `https://picsum.photos/seed/prozo-${profession}-${i}-${g}/600/450`),
  reviews: [0, 1, 2].map((r) => ({
    ...reviewPool[(i + r) % reviewPool.length],
    rating: r === 2 ? 4 : 5,
    date: `2026-0${(r % 8) + 6}-1${r}`,
  })),
}));

export const professionLabel = (p: Profession, lang: "en" | "he" = "en") =>
  PROFESSIONS.find((x) => x.id === p)?.[lang] ?? p;

export const PLATFORM_FEE = 0.1;

export const calcPrice = (rate: number, hours: number) => {
  const subtotal = rate * hours;
  const fee = Math.round(subtotal * PLATFORM_FEE);
  return { subtotal, fee, total: subtotal + fee };
};

export const hoursBetween = (start: string, end: string) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let d = eh * 60 + em - (sh * 60 + sm);
  if (d <= 0) d += 24 * 60;
  return Math.round((d / 60) * 2) / 2;
};
