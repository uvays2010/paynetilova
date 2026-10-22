/*
  SUBJECT: Paynet — Uzbekistan's payment-terminal network, reimagined as a concept super-app (UZ / RU / EN).
  Audience: an everyday Tashkent user paying phone, gas, internet, fines, loans. Job: pay any bill in 3 taps, keep every receipt.
  Real artifact stolen from: the Paynet kiosk's thermal receipt (chek) + Rishtan/Samarkand turquoise tilework.
  TYPE: Domine 600 (headlines, amounts) · Open Sans (UI) · JetBrains Mono (receipts, codes).
  COLOR: firuza #1A8FAD (lead) · kobalt-ink #0F3B4C · ochre #DF7700 · brick #A62F00 · lemon #FFF179 · paper #FFFDF2.
  SIGNATURE: every payment physically prints a thermal receipt out of a terminal slot, zig-zag torn edge.
  SETTINGS are real: language, theme, push/SMS toasts, limit warnings, PIN + biometric confirmation; all persisted.
*/
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Home, LayoutGrid, ReceiptText, PieChart, Repeat, MapPin, UserRound, Moon, Sun, ShieldCheck } from "lucide-react";
import "./styles.css";
import { AUTOPAY_SEED, catById, fmt, providerById, seedHistory, seedTerminalsAdmin } from "./data";
import { LangContext, translate } from "./i18n";
import PayModal from "./PayModal";
import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import HistoryPage from "./pages/History";
import StatsPage from "./pages/Stats";
import AutopayPage from "./pages/Autopay";
import TerminalsPage from "./pages/Terminals";
import ProfilePage from "./pages/Profile";
import AdminPage from "./pages/Admin";
import AdminLock from "./pages/AdminLock";

const NAV = [
  { id: "home", label: "Bosh sahifa", short: "Bosh", icon: Home },
  { id: "services", label: "Xizmatlar", short: "Xizmatlar", icon: LayoutGrid },
  { id: "history", label: "Cheklar", short: "Cheklar", icon: ReceiptText },
  { id: "stats", label: "Xarajatlar", short: "Xarajatlar", icon: PieChart },
  { id: "autopay", label: "Avtoto'lov", short: "Avtoto'lov", icon: Repeat },
  { id: "terminals", label: "Terminallar", short: "Terminallar", icon: MapPin },
  { id: "profile", label: "Sozlamalar", short: "Sozlamalar", icon: UserRound },
  { id: "admin", label: "Admin panel", short: "Admin", icon: ShieldCheck },
];
const MOBILE_NAV = ["home", "services", "history", "profile", "admin"];

export const DEFAULT_SETTINGS = { push: true, sms: false, limit: true, bio: false, pin: false, pinCode: "" };
const DEFAULT_LIMITS = { mobil: 150000, kommunal: 400000, internet: 150000, kredit: 500000, transport: 150000, oyin: 100000, talim: 1000000, tv: 60000, davlat: 400000, xayriya: 100000 };

function usePersist(key, initial) {
  const [v, setV] = useState(() => {
    try { const raw = localStorage.getItem("paynet:" + key); return raw != null ? JSON.parse(raw) : typeof initial === "function" ? initial() : initial; }
    catch { return typeof initial === "function" ? initial() : initial; }
  });
  useEffect(() => { try { localStorage.setItem("paynet:" + key, JSON.stringify(v)); } catch { /* storage unavailable */ } }, [key, v]);
  return [v, setV];
}

export default function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = usePersist("theme", "light");
  const [lang, setLang] = usePersist("lang", "uz");
  const [settings, setSettings] = usePersist("settings", DEFAULT_SETTINGS);
  const [limits, setLimits] = usePersist("limits", DEFAULT_LIMITS);
  const [balance, setBalance] = usePersist("balance", 2840500);
  const [history, setHistory] = usePersist("history", seedHistory);
  const [favorites, setFavorites] = usePersist("favorites", [
    { provider: "beeline", account: "+998 90 123 45 67", amount: 50000, label: "Mening raqamim" },
    { provider: "hududgaz", account: "1204 5577 81", amount: 150000, label: "Uy, gaz" },
    { provider: "uzonline", account: "uvays.e", amount: 120000, label: "Uy interneti" },
    { provider: "ucell", account: "+998 93 555 12 09", amount: 30000, label: "Onam" },
  ]);
  const [autopay, setAutopay] = usePersist("autopay", AUTOPAY_SEED);
  const [terminals, setTerminals] = usePersist("terminals", seedTerminalsAdmin);
  const [providerState, setProviderState] = usePersist("providers", {});
  const [adminOk, setAdminOk] = useState(false);
  const [pay, setPay] = useState(null);
  const [catFilter, setCatFilter] = useState(null);
  const tr = useCallback((s, v) => translate(lang, s, v), [lang]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [page]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const openPay = useCallback((providerId, prefill) => {
    const st = providerState[providerId] || {};
    if (st.on === false) return toast.error(tr("Bu xizmat vaqtincha o'chirilgan"));
    setPay({ provider: { ...providerById[providerId], fee: st.fee ?? providerById[providerId].fee }, prefill });
  }, [providerState, tr]);
  const go = useCallback((p, cat = null) => { setCatFilter(cat); setPage(p); }, []);
  const isFav = (pid, acc) => favorites.some((f) => f.provider === pid && f.account === acc);
  const addFav = (f) => {
    if (isFav(f.provider, f.account)) return;
    setFavorites((x) => [...x, { ...f, label: providerById[f.provider].name }]);
    toast.success(tr("Sevimlilarga qo'shildi"));
  };
  const removeFav = (i) => setFavorites((x) => x.filter((_, j) => j !== i));
  const topUp = (n) => { setBalance((b) => b + n); toast.success(tr("Hamyon to'ldirildi: +{sum} so'm", { sum: fmt(n) })); };

  const onPaid = (t, total) => {
    setHistory((h) => [t, ...h]);
    setBalance((b) => b - total);
    const p = providerById[t.provider];
    if (settings.push) toast.success(tr("To'lov o'tdi: {name}, {sum} so'm", { name: tr(p.name), sum: fmt(total) }));
    if (settings.sms) setTimeout(() => toast(tr("SMS: Paynet hamyondan {sum} so'm yechildi", { sum: fmt(total) })), 600);
    if (settings.limit) {
      const now = new Date();
      const spent = [t, ...history].filter((x) => x.status === "ok" && providerById[x.provider].cat === p.cat && new Date(x.date).getMonth() === now.getMonth() && new Date(x.date).getFullYear() === now.getFullYear()).reduce((s, x) => s + x.amount, 0);
      const lim = limits[p.cat];
      if (spent >= lim * 0.8) setTimeout(() => toast.warning(tr("Limit: «{cat}» bo'yicha {pct}% ishlatildi", { cat: tr(catById[p.cat].name), pct: Math.round((spent / lim) * 100) })), 1200);
    }
  };

  const resetAll = () => {
    Object.keys(localStorage).filter((k) => k.startsWith("paynet:")).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  const ctx = { balance, history, favorites, autopay, setAutopay, openPay, go, catFilter, removeFav, topUp, theme, setTheme, terminals, setTerminals, providerState, setProviderState, lang, setLang, settings, setSettings, limits, setLimits, resetAll };

  return (
    <LangContext.Provider value={lang}>
      <div className="app" data-theme={theme}>
        <Toaster position="top-center" theme={theme} toastOptions={{ style: { fontFamily: "Open Sans", fontSize: 15 } }} />
        <div className="mx-auto flex max-w-[1440px]">
          <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col px-5 py-7 lg:flex">
            <button onClick={() => go("home")} className="focus-ring flex items-center gap-3 rounded-xl px-2 text-left">
              <Logo />
              <div>
                <div className="font-head text-[22px] font-bold tracking-[0.06em]">paynet</div>
                <div className="-mt-1 text-[13px] font-semibold soft">{tr("konsept")} · 2026</div>
              </div>
            </button>
            <nav className="mt-10 flex flex-col gap-1" aria-label={tr("Asosiy")}>
              {NAV.map((n) => {
                const on = page === n.id;
                return (
                  <button key={n.id} onClick={() => go(n.id)} aria-current={on ? "page" : undefined}
                    className={`${n.id === "admin" ? "mt-5 " : ""}focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${on ? "bg-[var(--ink)] text-[var(--bg)]" : "soft hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"}`}>
                    <n.icon size={19} strokeWidth={2.2} /> {tr(n.label)}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto">
              <div className="surface-2 mb-2 flex rounded-xl p-1" role="group" aria-label={tr("Til")}>
                {[["uz", "UZ"], ["ru", "RU"], ["en", "EN"]].map(([k, l]) => (
                  <button key={k} onClick={() => setLang(k)} aria-pressed={lang === k} className={`focus-ring flex-1 rounded-lg py-1.5 text-[14px] font-bold ${lang === k ? "bg-[var(--ink)] text-[var(--bg)]" : "soft"}`}>{l}</button>
                ))}
              </div>
              <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="focus-ring flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold soft hover:bg-[var(--surface-2)]">
                {theme === "light" ? <Moon size={19} /> : <Sun size={19} />} {theme === "light" ? tr("Tungi rejim") : tr("Kunduzgi rejim")}
              </button>
              <p className="mt-3 px-4 text-[13px] leading-snug soft">{tr("Mustaqil dizayn konsepti. Paynet bilan rasmiy aloqasi yo'q, haqiqiy to'lov amalga oshmaydi.")}</p>
            </div>
          </aside>

          <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-8 lg:pb-12 lg:pt-7">
            <header className="mb-5 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2.5"><Logo size={34} /><span className="font-head text-[20px] font-bold tracking-[0.06em]">paynet</span></div>
              <div className="flex items-center gap-2">
                <button onClick={() => setLang(lang === "uz" ? "ru" : lang === "ru" ? "en" : "uz")} className="focus-ring surface rounded-full px-3 py-2 text-[14px] font-bold" aria-label={tr("Til")}>{lang.toUpperCase()}</button>
                <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="focus-ring rounded-full p-2.5 surface" aria-label={tr("Rejimni almashtirish")}>
                  {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
                </button>
              </div>
            </header>
            {page === "home" && <HomePage {...ctx} />}
            {page === "services" && <ServicesPage {...ctx} />}
            {page === "history" && <HistoryPage {...ctx} />}
            {page === "stats" && <StatsPage {...ctx} />}
            {page === "autopay" && <AutopayPage {...ctx} />}
            {page === "terminals" && <TerminalsPage {...ctx} />}
            {page === "profile" && <ProfilePage {...ctx} />}
            {page === "admin" && (adminOk ? <AdminPage {...ctx} onLogout={() => { setAdminOk(false); go("home"); }} /> : <AdminLock onUnlock={() => setAdminOk(true)} />)}
          </main>
        </div>

        <nav className="surface fixed inset-x-0 bottom-0 z-40 flex justify-around border-t line px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden" aria-label={tr("Pastki")}>
          {NAV.filter((n) => MOBILE_NAV.includes(n.id)).map((n) => (
            <button key={n.id} onClick={() => go(n.id)} className={`focus-ring flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[12px] font-semibold ${page === n.id ? "text-[var(--firuza-text)]" : "soft"}`} aria-current={page === n.id ? "page" : undefined}>
              <n.icon size={21} /> {tr(n.short)}
            </button>
          ))}
        </nav>

        <AnimatePresence>
          {pay && (
            <PayModal
              key={pay.provider.id}
              provider={pay.provider}
              prefill={pay.prefill}
              balance={balance}
              settings={settings}
              onClose={() => setPay(null)}
              onPaid={onPaid}
              onFavorite={addFav}
              isFav={isFav}
              goHistory={() => { setPay(null); go("history"); }}
            />
          )}
        </AnimatePresence>
      </div>
    </LangContext.Provider>
  );
}

function Logo({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect width="48" height="48" rx="14" fill="var(--firuza)" />
      <path d="M24 8 L28.5 19.5 L40 24 L28.5 28.5 L24 40 L19.5 28.5 L8 24 L19.5 19.5 Z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="3.6" fill="#FFF179" />
    </svg>
  );
}
