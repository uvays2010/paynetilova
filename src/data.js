import { Smartphone, Flame, Zap, Droplets, Wifi, Tv, Landmark, Car, GraduationCap, Gamepad2, HeartHandshake, Bus, Trash2, Building2 } from "lucide-react";

export const CATEGORIES = [
  { id: "mobil", name: "Mobil aloqa", icon: Smartphone, color: "#1E9BB8" },
  { id: "kommunal", name: "Kommunal", icon: Flame, color: "#DF7700" },
  { id: "internet", name: "Internet", icon: Wifi, color: "#2C6E8F" },
  { id: "tv", name: "Televideniye", icon: Tv, color: "#7A4A9E" },
  { id: "davlat", name: "Davlat xizmatlari", icon: Landmark, color: "#A62F00" },
  { id: "transport", name: "Transport", icon: Bus, color: "#3E8E5A" },
  { id: "talim", name: "Ta'lim", icon: GraduationCap, color: "#B5651D" },
  { id: "kredit", name: "Kredit va banklar", icon: Building2, color: "#0F3B4C" },
  { id: "oyin", name: "O'yinlar", icon: Gamepad2, color: "#C2185B" },
  { id: "xayriya", name: "Xayriya", icon: HeartHandshake, color: "#6A8D2F" },
];

const P = (id, name, cat, field, extra = {}) => ({ id, name, cat, field, ...extra });

export const PROVIDERS = [
  P("beeline", "Beeline", "mobil", "Telefon raqami", { popular: true, fee: 0, short: "BE" }),
  P("ucell", "Ucell", "mobil", "Telefon raqami", { popular: true, fee: 0, short: "UC" }),
  P("mobiuz", "Mobiuz", "mobil", "Telefon raqami", { popular: true, fee: 0, short: "MB" }),
  P("uzmobile", "Uzmobile", "mobil", "Telefon raqami", { fee: 0, short: "UZ" }),
  P("humans", "Humans", "mobil", "Telefon raqami", { fee: 0, short: "HU" }),
  P("perfectum", "Perfectum Mobile", "mobil", "Telefon raqami", { fee: 0, short: "PM" }),
  P("hududgaz", "Hududgaz", "kommunal", "Hisob raqami", { popular: true, fee: 0, short: "HG" }),
  P("elektr", "Hududiy elektr tarmoqlari", "kommunal", "Hisob raqami", { popular: true, fee: 0, short: "HE" }),
  P("suv", "Suvsoqov", "kommunal", "Hisob raqami", { fee: 0, short: "SV" }),
  P("issiq", "Toshissiqquvvat", "kommunal", "Hisob raqami", { fee: 0, short: "TI" }),
  P("toza", "Toza hudud", "kommunal", "Hisob raqami", { fee: 0, short: "TH" }),
  P("uy", "Uy-joy mulkdorlari shirkati", "kommunal", "Shaxsiy hisob", { fee: 1, short: "XU" }),
  P("uzonline", "Uzonline", "internet", "Login", { popular: true, fee: 0, short: "UO" }),
  P("sarkor", "Sarkor Telecom", "internet", "Shartnoma raqami", { fee: 0, short: "ST" }),
  P("tps", "TPS", "internet", "Login", { fee: 0, short: "TP" }),
  P("comnet", "Comnet", "internet", "Login", { fee: 0, short: "CN" }),
  P("turontelecom", "Turon Telecom", "internet", "Shartnoma raqami", { fee: 0, short: "TT" }),
  P("evo", "EVO", "internet", "Telefon raqami", { fee: 0, short: "EV" }),
  P("uzdigital", "UzDigital TV", "tv", "Karta raqami (ID)", { fee: 0, short: "UD" }),
  P("itv", "iTV", "tv", "Login", { fee: 0, short: "iT" }),
  P("allplay", "Allplay", "tv", "Login", { fee: 0, short: "AP" }),
  P("kinopoisk", "Kinopoisk", "tv", "Telefon raqami", { fee: 1.5, short: "KP" }),
  P("soliq", "Mol-mulk solig'i", "davlat", "STIR / JShShIR", { popular: true, fee: 0, short: "MS" }),
  P("jarima", "YHXBB jarimalari", "davlat", "Qaror raqami", { popular: true, fee: 0, short: "YH" }),
  P("bojxona", "Bojxona to'lovlari", "davlat", "Deklaratsiya raqami", { fee: 0, short: "BJ" }),
  P("davlatboj", "Davlat boji", "davlat", "Ariza raqami", { fee: 0, short: "DB" }),
  P("pasport", "ID-karta xizmatlari", "davlat", "JShShIR", { fee: 0, short: "ID" }),
  P("metro", "Toshkent metro (ATTO)", "transport", "Karta raqami", { popular: true, fee: 0, short: "AT" }),
  P("yandex", "Yandex Go", "transport", "Telefon raqami", { fee: 1, short: "YG" }),
  P("mytaxi", "MyTaxi", "transport", "Telefon raqami", { fee: 1, short: "MT" }),
  P("toshyol", "Pullik yo'llar", "transport", "Avto raqami", { fee: 0, short: "PY" }),
  P("bogcha", "Davlat bog'chalari", "talim", "Bola ID", { fee: 0, short: "BG" }),
  P("universitet", "OTM kontrakt to'lovi", "talim", "Shartnoma raqami", { popular: true, fee: 0, short: "OT" }),
  P("najot", "Najot Ta'lim", "talim", "O'quvchi ID", { fee: 0, short: "NT" }),
  P("pdp", "PDP Academy", "talim", "O'quvchi ID", { fee: 0, short: "PD" }),
  P("uzum", "Uzum Nasiya", "kredit", "Shartnoma raqami", { popular: true, fee: 0, short: "UN" }),
  P("alif", "Alif Nasiya", "kredit", "Shartnoma raqami", { fee: 0, short: "AN" }),
  P("kapital", "Kapitalbank krediti", "kredit", "Kredit raqami", { fee: 0, short: "KB" }),
  P("hamkor", "Hamkorbank krediti", "kredit", "Kredit raqami", { fee: 0, short: "HB" }),
  P("ipoteka", "Ipoteka bank", "kredit", "Kredit raqami", { fee: 0, short: "IB" }),
  P("pubg", "PUBG Mobile UC", "oyin", "O'yinchi ID", { fee: 2, short: "PG" }),
  P("steam", "Steam hamyoni", "oyin", "Steam login", { fee: 3, short: "SM" }),
  P("freefire", "Free Fire olmos", "oyin", "O'yinchi ID", { fee: 2, short: "FF" }),
  P("mehr", "Mehr-shafqat jamg'armasi", "xayriya", "Ism (ixtiyoriy)", { fee: 0, short: "MJ" }),
  P("ezgu", "Ezgu ish", "xayriya", "Ism (ixtiyoriy)", { fee: 0, short: "EI" }),
  P("hayot", "Hayot fondi", "xayriya", "Ism (ixtiyoriy)", { fee: 0, short: "HF" }),
];

export const providerById = Object.fromEntries(PROVIDERS.map((p) => [p.id, p]));
export const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

// seed history: last ~6 months
export function seedHistory() {
  const r = rnd(42);
  const list = [];
  const now = new Date("2026-10-22T17:45:00");
  const recurring = [
    ["beeline", "+998 90 123 45 67", 50000, 26],
    ["hududgaz", "1204 5577 81", 0, 5],
    ["elektr", "0047 1192 30", 0, 7],
    ["uzonline", "uvays.e", 120000, 2],
    ["uzum", "UN-2026-04471", 487000, 15],
    ["metro", "9860 •••• 4471", 60000, 1],
  ];
  for (let m = 0; m < 6; m++) {
    recurring.forEach(([pid, acc, amt, day]) => {
      const d = new Date(now.getFullYear(), now.getMonth() - m, day, 9 + Math.floor(r() * 11), Math.floor(r() * 59));
      if (d > now) return;
      let a = amt;
      if (pid === "hududgaz") a = Math.round((m >= 1 && m <= 4 ? 45000 : 140000 + r() * 60000) / 1000) * 1000;
      if (pid === "elektr") a = Math.round((90000 + r() * 70000) / 1000) * 1000;
      list.push({ id: `seed-${pid}-${m}`, provider: pid, account: acc, amount: a, date: d.toISOString(), status: "ok" });
    });
    const extras = ["yandex", "pubg", "jarima", "mehr", "ucell", "itv", "toza", "najot", "steam", "suv"];
    const n = 3 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const pid = extras[Math.floor(r() * extras.length)];
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1 + Math.floor(r() * 27), 8 + Math.floor(r() * 14), Math.floor(r() * 59));
      if (d > now) continue;
      const base = { yandex: 35000, pubg: 64000, jarima: 375000, mehr: 50000, ucell: 30000, itv: 39000, toza: 18000, najot: 990000, steam: 110000, suv: 26000 }[pid];
      list.push({ id: `seed-x-${m}-${i}`, provider: pid, account: pid === "jarima" ? "AA 1290 4471" : "—", amount: Math.round(base * (0.7 + r() * 0.8) / 1000) * 1000, date: d.toISOString(), status: r() > 0.94 ? "fail" : "ok" });
    }
  }
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const TERMINALS = [
  { id: 1, name: "Chorsu bozori, 2-kirish", district: "Shayxontohur", x: 31, y: 44, h24: true, cashin: true, status: "ishlaydi" },
  { id: 2, name: "Magic City savdo markazi", district: "Yunusobod", x: 58, y: 18, h24: false, cashin: true, status: "ishlaydi" },
  { id: 3, name: "Amir Temur xiyoboni metro", district: "Mirobod", x: 52, y: 48, h24: true, cashin: true, status: "ishlaydi" },
  { id: 4, name: "Korzinka, Buyuk Ipak Yo'li", district: "Mirzo Ulug'bek", x: 74, y: 40, h24: true, cashin: false, status: "ishlaydi" },
  { id: 5, name: "Next, Bobur ko'chasi", district: "Yakkasaroy", x: 47, y: 62, h24: false, cashin: true, status: "ta'mirda" },
  { id: 6, name: "Toshkent vokzali", district: "Mirobod", x: 60, y: 66, h24: true, cashin: true, status: "ishlaydi" },
  { id: 7, name: "Samarqand Darvoza", district: "Olmazor", x: 22, y: 56, h24: false, cashin: true, status: "ishlaydi" },
  { id: 8, name: "Sergeli dehqon bozori", district: "Sergeli", x: 46, y: 86, h24: false, cashin: false, status: "ishlaydi" },
  { id: 9, name: "Chilonzor 10-kvartal", district: "Chilonzor", x: 30, y: 70, h24: true, cashin: true, status: "ishlaydi" },
  { id: 10, name: "Westminster universiteti", district: "Shayxontohur", x: 38, y: 34, h24: false, cashin: false, status: "ishlaydi" },
  { id: 11, name: "Yashnobod, Parkent bozori", district: "Yashnobod", x: 80, y: 58, h24: false, cashin: true, status: "naqd yo'q" },
  { id: 12, name: "Olmazor, Qorasaroy", district: "Olmazor", x: 18, y: 36, h24: true, cashin: false, status: "ishlaydi" },
  { id: 13, name: "Mega Planet", district: "Yunusobod", x: 64, y: 28, h24: false, cashin: true, status: "ishlaydi" },
  { id: 14, name: "Bektemir, Avtoservis", district: "Bektemir", x: 84, y: 82, h24: true, cashin: true, status: "ishlaydi" },
  { id: 15, name: "Uchtepa, Farhod bozori", district: "Uchtepa", x: 14, y: 72, h24: false, cashin: true, status: "ishlaydi" },
];

export const AUTOPAY_SEED = [
  { id: "a1", provider: "beeline", account: "+998 90 123 45 67", amount: 50000, rule: "Balans 5 000 so'mdan tushsa", on: true },
  { id: "a2", provider: "uzonline", account: "uvays.e", amount: 120000, rule: "Har oyning 2-sanasi", on: true },
  { id: "a3", provider: "uzum", account: "UN-2026-04471", amount: 487000, rule: "Har oyning 15-sanasi", on: true },
  { id: "a4", provider: "metro", account: "9860 •••• 4471", amount: 60000, rule: "Har dushanba", on: false },
];

export const fmt = (n) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
export const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
export const MONTHS_SHORT = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
export const MONTHS_BY = {
  uz: MONTHS,
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
export const MONTHS_NOM = {
  uz: MONTHS,
  ru: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
  en: MONTHS_BY.en,
};
export const MONTHS_SHORT_BY = {
  uz: MONTHS_SHORT,
  ru: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
export const DAYS_BY = {
  uz: ["Yak", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
  ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
export const fmtDate = (iso, lang = "uz") => { const d = new Date(iso); return lang === "en" ? `${MONTHS_BY.en[d.getMonth()]} ${d.getDate()}` : `${d.getDate()} ${MONTHS_BY[lang][d.getMonth()]}`; };
export const fmtTime = (iso) => { const d = new Date(iso); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

export const ADMIN_USERS = [
  ["Uvays Eshboyev", "+998 90 123 45 67", "Toshkent", 3, 2840500, 214],
  ["Dilnoza Karimova", "+998 93 410 22 18", "Samarqand", 3, 1204000, 168],
  ["Javohir To'xtayev", "+998 97 551 09 74", "Toshkent", 2, 386500, 92],
  ["Madina Rasulova", "+998 99 702 33 61", "Buxoro", 2, 74200, 41],
  ["Sardor Yo'ldoshev", "+998 91 230 88 05", "Andijon", 1, 15000, 7],
  ["Gulnora Abdullayeva", "+998 94 118 47 90", "Farg'ona", 3, 5120000, 302],
  ["Bekzod Nurmatov", "+998 90 664 12 30", "Namangan", 2, 432000, 77],
  ["Shahnoza Ergasheva", "+998 95 309 71 46", "Toshkent", 3, 990700, 133],
  ["Otabek Hamidov", "+998 88 470 25 52", "Qarshi", 1, 0, 3],
  ["Nilufar Mirzayeva", "+998 93 845 60 17", "Xiva", 2, 268000, 55],
  ["Aziz Qodirov", "+998 97 215 94 83", "Nukus", 2, 1450000, 120],
  ["Kamola Saidova", "+998 99 588 03 29", "Jizzax", 1, 42000, 12],
].map(([name, phone, city, kyc, balance, tx], i) => ({ id: i + 1, name, phone, city, kyc, balance, tx, blocked: i === 8 }));

export const seedTerminalsAdmin = () => TERMINALS.map((t, i) => ({ ...t, cash: [82, 34, 61, 12, 0, 91, 47, 23, 70, 8, 55, 66, 39, 88, 18][i], ping: [1, 2, 1, 4, 37, 1, 3, 2, 1, 6, 12, 1, 2, 1, 3][i], uptime: [99.8, 98.1, 99.9, 97.4, 81.2, 99.6, 98.8, 96.5, 99.7, 95.0, 92.3, 99.1, 98.4, 99.9, 97.0][i] }));
