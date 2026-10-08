export type Profession = "lifeguard" | "security" | "medic" | "photographer" | "electrician" | "plumber" | "cleaning" | "waiter";

export const PROFESSIONS: { id: Profession; label: string }[] = [
  { id: "lifeguard", label: "מציל בריכה" },
  { id: "security", label: "מאבטח / סלקטור" },
  { id: "medic", label: "חובש / עזרה ראשונה" },
  { id: "photographer", label: "צלם אירועים" },
  { id: "electrician", label: "חשמלאי מוסמך" },
  { id: "plumber", label: "אינסטלטור" },
  { id: "cleaning", label: "ניקיון ותחזוקה" },
  { id: "waiter", label: "מלצר / ברמן" },
];

export const CITIES = [
  { he: "תל אביב", en: "Tel Aviv" },
  { he: "הרצליה", en: "Herzliya" },
  { he: "חיפה", en: "Haifa" },
  { he: "ראשון לציון", en: "Rishon LeZion" },
  { he: "ירושלים", en: "Jerusalem" },
];

export interface Review { author: string; rating: number; text: string; date: string }
export interface Pro {
  id: string;
  name: string;
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
  lifeguard: ["תעודת מציל בריכה – משרד התרבות והספורט", "הסמכת החייאה ודפיברילטור (2025)", "רענון עזרה ראשונה"],
  security: ["רישיון מאבטח – המשרד לביטחון לאומי", "הסמכה לניהול קהל", "עזרה ראשונה בסיסית"],
  medic: ["חובש מוסמך מד״א", "הסמכת BLS / ACLS", "הכשרה לאירוע רב־נפגעים"],
  photographer: ["תעודת צילום מקצועי", "רישיון מפעיל רחפן – רת״א", "הסמכת Adobe מקצועית"],
  electrician: ["רישיון חשמלאי מוסמך – משרד העבודה", "הסמכה לעבודה בגובה", "ביטוח צד ג׳ בתוקף"],
  plumber: ["תעודת אינסטלטור מוסמך", "הסמכה למערכות גז", "ביטוח צד ג׳ בתוקף"],
  cleaning: ["הכשרה בחומרי ניקוי מקצועיים", "בדיקת רקע תקינה", "ביטוח צד ג׳ בתוקף"],
  waiter: ["קורס ברמנות מקצועי", "הכשרה בתברואה ובטיחות מזון", "בדיקת רקע תקינה"],
};

const bios: Record<Profession, string> = {
  lifeguard: "מציל/ה מוסמך/ת עם ניסיון רב במסיבות בריכה בווילות, בריכות מלונות ואירועי קיץ של חברות. רגוע/ה, ערני/ת וממוקד/ת בבטיחות האורחים.",
  security: "לוחם/ת קרבי לשעבר ומאבטח/ת בעל/ת רישיון. מתמחה בבקרת כניסה, אבטחת אישים וניהול זרימת קהל באירועים פרטיים ועסקיים.",
  medic: "מגיש/ה ראשון/ה מנוסה המעניק/ה כיסוי רפואי באירועים, פסטיבלים, חתונות ואירועי ספורט. מגיע/ה עם ציוד טראומה ודפיברילטור מלא.",
  photographer: "צלם/ת אירועים שתופס/ת רגעים אותנטיים וקולנועיים בחתונות, בר/ת מצוות והשקות מותג. גלריה ערוכה תוך 72 שעות.",
  electrician: "חשמלאי/ת מוסמך/ת לתיקונים, התקנות ובדיקות בבתים, משרדים ואירועים. עבודה נקייה, בטוחה ובזמן.",
  plumber: "אינסטלטור/ית מנוסה לתיקון נזילות, פתיחת סתימות והתקנות. מגיע/ה מהר ועם כל הציוד הדרוש.",
  cleaning: "צוות ניקיון מקצועי לבתים, משרדים ולפני ואחרי אירועים. יסודיות, דיסקרטיות ועמידה בזמנים.",
  waiter: "מלצר/ית וברמן/ית עם ניסיון באירועים פרטיים ועסקיים. שירות אדיב, מהיר ומקצועי.",
};

const raw: [string, Profession, number, number, string][] = [
  ["נועה לוי", "lifeguard", 0, 140, "women/44"],
  ["איתי כהן", "lifeguard", 1, 130, "men/32"],
  ["יעל מזרחי", "lifeguard", 3, 125, "women/65"],
  ["עומר פרץ", "lifeguard", 2, 120, "men/45"],
  ["אבי ביטון", "security", 0, 110, "men/75"],
  ["דניאל פרידמן", "security", 4, 115, "men/11"],
  ["שירה אזולאי", "security", 1, 120, "women/22"],
  ["איתן שפירא", "security", 2, 105, "men/52"],
  ["תמר בן דוד", "medic", 0, 160, "women/33"],
  ["יונתן כץ", "medic", 4, 150, "men/86"],
  ["מיכל דהן", "medic", 3, 155, "women/90"],
  ["רון אברהם", "medic", 2, 145, "men/22"],
  ["מאיה גולדברג", "photographer", 0, 320, "women/68"],
  ["ליאור הלוי", "photographer", 1, 280, "men/67"],
  ["גל אוחנה", "photographer", 4, 300, "women/12"],
  ["אריאל ששון", "photographer", 3, 260, "men/36"],
  ["משה אלון", "electrician", 0, 180, "men/14"],
  ["אלון רביבו", "electrician", 2, 170, "men/61"],
  ["יוסף נחום", "plumber", 4, 160, "men/41"],
  ["עידו ברק", "plumber", 1, 165, "men/28"],
  ["סיגל עמר", "cleaning", 3, 90, "women/50"],
  ["אורית חדד", "cleaning", 0, 95, "women/57"],
  ["נטע שלום", "waiter", 1, 85, "women/29"],
  ["תום ויס", "waiter", 2, 80, "men/19"],
];

const reviewPool = [
  { author: "דנה ר.", text: "מקצועי ברמה הכי גבוהה ודייקן. עבודה מעולה מההתחלה ועד הסוף." },
  { author: "יוסי ק.", text: "הזמנתי תוך שתי דקות, הגיע מוקדם ועם גישה מעולה. ממליץ בחום!" },
  { author: "הילה מ.", text: "בדיוק מה שהיינו צריכים. בטוח נזמין שוב." },
  { author: "עמית ס.", text: "אדיב, דיסקרטי ואמין. תקשורת מצוינת לאורך כל הדרך." },
];

export const PROS: Pro[] = raw.map(([name, profession, cityIdx, rate, img], i) => ({
  id: `pro-${i + 1}`,
  name,
  profession,
  city: CITIES[cityIdx]!.he,
  rate,
  minHours: profession === "photographer" ? 3 : ["electrician", "plumber"].includes(profession) ? 1 : 4,
  rating: Math.round((4.6 + ((i * 7) % 5) / 12) * 10) / 10,
  reviewsCount: 18 + ((i * 13) % 90),
  avatar: `https://randomuser.me/api/portraits/${img}.jpg`,
  bio: bios[profession],
  certifications: certs[profession],
  years: 2 + (i % 9),
  gallery:
    ["photographer", "waiter"].includes(profession)
      ? Array.from({ length: 6 }, (_, g) => `https://picsum.photos/seed/prozo-${i}-${g}/600/450`)
      : Array.from({ length: 3 }, (_, g) => `https://picsum.photos/seed/prozo-${profession}-${i}-${g}/600/450`),
  reviews: [0, 1, 2].map((r) => ({
    ...reviewPool[(i + r) % reviewPool.length]!,
    rating: r === 2 ? 4 : 5,
    date: `2026-0${(r % 3) + 6}-1${r}`,
  })),
}));

export const professionLabel = (p: Profession | string) => PROFESSIONS.find((x) => x.id === p)?.label ?? p;

/** Match a city query in Hebrew or English against a pro's (Hebrew) city. */
export const cityMatches = (proCity: string, q?: string) => {
  if (!q) return true;
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const c = CITIES.find((x) => x.he === proCity);
  return proCity.includes(query) || !!c?.en.toLowerCase().includes(query);
};

export const PLATFORM_FEE = 0.1;

export const calcPrice = (rate: number, hours: number) => {
  const subtotal = rate * hours;
  const fee = Math.round(subtotal * PLATFORM_FEE);
  return { subtotal, fee, total: subtotal + fee };
};

export const hoursBetween = (start: string, end: string) => {
  const [sh = 0, sm = 0] = start.split(":").map(Number);
  const [eh = 0, em = 0] = end.split(":").map(Number);
  let d = eh * 60 + em - (sh * 60 + sm);
  if (d <= 0) d += 24 * 60;
  return Math.round((d / 60) * 2) / 2;
};
