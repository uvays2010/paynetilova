import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Activity, AlertTriangle, Search, RotateCw, Banknote, Ban, ShieldCheck, Minus, Plus, Undo2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_USERS, CATEGORIES, PROVIDERS, catById, fmt, fmtDate, fmtTime, providerById } from "../data";
import { ProviderMark } from "../ui";
import { useT } from "../i18n";

const TABS = [["overview", "Umumiy"], ["tx", "Tranzaksiyalar"], ["terminals", "Terminallar"], ["providers", "Provayderlar"], ["users", "Foydalanuvchilar"]];
const STATUS = { ishlaydi: ["Ishlaydi", "var(--firuza-text)"], "ta'mirda": ["Ta'mirda", "var(--brick)"], "naqd yo'q": ["Naqd to'la", "var(--ochre)"], "o'chiq": ["O'chiq", "var(--ink-soft)"] };
const NAMES = ["D. Karimova", "J. To'xtayev", "M. Rasulova", "G. Abdullayeva", "B. Nurmatov", "S. Ergasheva", "A. Qodirov", "N. Mirzayeva", "K. Saidova", "U. Eshboyev"];

function useLiveFeed(paused) {
  const [feed, setFeed] = useState([]);
  const [today, setToday] = useState({ sum: 18412300000, count: 412880, fail: 3917 });
  const seed = useRef(7);
  useEffect(() => {
    if (paused) return;
    const r = () => (seed.current = (seed.current * 16807) % 2147483647) / 2147483647;
    const tick = () => {
      const p = PROVIDERS[Math.floor(r() * PROVIDERS.length)];
      const amount = Math.round((5000 + r() * r() * 600000) / 1000) * 1000;
      const fail = r() > 0.95;
      const t = { id: `live-${Date.now()}-${Math.floor(r() * 1e4)}`, provider: p.id, user: NAMES[Math.floor(r() * NAMES.length)], terminal: `PN-TSH-${String(4400 + Math.floor(r() * 99)).padStart(5, "0")}`, amount, date: new Date().toISOString(), status: fail ? "fail" : "ok" };
      setFeed((f) => [t, ...f].slice(0, 60));
      setToday((x) => ({ sum: x.sum + (fail ? 0 : amount) * 37, count: x.count + 37, fail: x.fail + (fail ? 2 : 0) }));
    };
    for (let i = 0; i < 12; i++) tick();
    const id = setInterval(tick, 1500);
    return () => clearInterval(id);
  }, [paused]);
  return { feed, setFeed, today };
}

export default function AdminPage({ onLogout, history, terminals, setTerminals, providerState, setProviderState }) {
  const tr = useT();
  const [tab, setTab] = useState("overview");
  const [paused, setPaused] = useState(false);
  const { feed, setFeed, today } = useLiveFeed(paused);
  const incidents = terminals.filter((t) => t.status !== "ishlaydi" || t.cash > 85 || t.ping > 10);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.14em] text-[var(--brick)]"><ShieldCheck size={16} /> {tr("Boshqaruv paneli")}</div>
          <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Admin")}</h1>
        </div>
        <div className="flex items-center gap-2">
        <button onClick={onLogout} className="focus-ring surface flex items-center gap-2 rounded-full border line px-4 py-2 text-[14px] font-semibold"><LogOut size={16} /> {tr("Chiqish")}</button>
        <button onClick={() => setPaused(!paused)} className="focus-ring surface flex items-center gap-2 rounded-full border line px-4 py-2 text-[14px] font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${paused ? "bg-[var(--ink-soft)]" : "animate-pulse bg-[var(--firuza)]"}`} /> {paused ? tr("Pauza") : tr("Jonli oqim")}
        </button>
        </div>
      </div>

      <div className="scroll-thin sticky top-0 z-20 -mx-4 mt-5 flex gap-1 overflow-x-auto bg-[var(--bg)] px-4 py-2 sm:-mx-8 sm:px-8">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`focus-ring shrink-0 rounded-xl px-4 py-2.5 text-[15px] font-semibold transition ${tab === k ? "bg-[var(--ink)] text-[var(--bg)]" : "soft hover:bg-[var(--surface)]"}`}>
            {tr(l)}{k === "terminals" && incidents.length > 0 && <span className="ml-2 rounded-full bg-[var(--brick)] px-1.5 text-[12px] text-white">{incidents.length}</span>}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && <Overview today={today} feed={feed} incidents={incidents} go={setTab} />}
        {tab === "tx" && <Transactions feed={feed} setFeed={setFeed} />}
        {tab === "terminals" && <Fleet terminals={terminals} setTerminals={setTerminals} />}
        {tab === "providers" && <Providers providerState={providerState} setProviderState={setProviderState} />}
        {tab === "users" && <Users />}
      </div>
    </div>
  );
}

function Overview({ today, feed, incidents, go }) {
  const tr = useT();
  const hourly = useMemo(() => Array.from({ length: 19 }, (_, h) => ({ h: `${h}:00`, v: Math.round((Math.sin((h - 4) / 3.2) + 1.3) * 820 + (h > 8 ? 900 : 0) + ((h * 37) % 11) * 60) })), []);
  const success = (((today.count - today.fail) / today.count) * 100).toFixed(2);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[28px] p-7 text-white sm:p-9" style={{ background: "#0F3B4C" }}>
          <div className="girih opacity-60" />
          <div className="relative">
            <div className="text-[15px] font-semibold text-[#6AD5E8]">{tr("Bugungi aylanma · butun tarmoq")}</div>
            <div className="tnum mt-2 font-head text-[44px] font-semibold leading-none tracking-[-0.02em] sm:text-[72px]">{fmt(today.sum)}<span className="ml-3 text-[20px] text-[#FFF179]">{tr("so'm")}</span></div>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[[tr("Tranzaksiya"), fmt(today.count)], [tr("Muvaffaqiyat"), `${success}%`], [tr("Faol terminal"), "12 418"]].map(([k, v]) => (
                <div key={k}><div className="tnum font-head text-[22px] font-semibold sm:text-[28px]">{v}</div><div className="text-[14px] text-white/70">{k}</div></div>
              ))}
            </div>
          </div>
        </section>
        <section className="surface rounded-[28px] border line p-6">
          <div className="flex items-baseline justify-between"><h2 className="font-head text-[22px] font-semibold">{tr("Soatlik yuklama")}</h2><span className="text-[14px] soft">{tr("tranzaksiya / daqiqa")}</span></div>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--firuza)" stopOpacity=".45" /><stop offset="1" stopColor="var(--firuza)" stopOpacity="0" /></linearGradient></defs>
                <XAxis dataKey="h" interval={2} padding={{ left: 14, right: 14 }} axisLine={false} tickLine={false} tick={{ fill: "var(--ink-soft)", fontSize: 13 }} />
                <Tooltip formatter={(v) => [fmt(v), tr("tr/daq")]} contentStyle={{ borderRadius: 14, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: 14 }} />
                <Area dataKey="v" type="monotone" stroke="var(--firuza)" strokeWidth={2.5} fill="url(#ag)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="surface rounded-[28px] border line p-6">
          <div className="flex items-center justify-between"><h2 className="font-head text-[22px] font-semibold">{tr("Hodisalar")}</h2><button onClick={() => go("terminals")} className="focus-ring text-[14px] font-semibold text-[var(--firuza-text)]">{tr("Terminallarga")}</button></div>
          <div className="mt-4 space-y-2">
            {incidents.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-2xl surface-2 px-4 py-3 text-[15px]">
                <AlertTriangle size={18} className={t.status === "ta'mirda" ? "text-[var(--brick)]" : "text-[var(--ochre)]"} />
                <span className="flex-1 font-semibold">{t.name}</span>
                <span className="soft">{t.status !== "ishlaydi" ? tr(STATUS[t.status][0]) : t.cash > 85 ? `${tr("Kassa")} ${t.cash}%` : `Ping ${t.ping} ${tr("daq")}`}</span>
              </div>
            ))}
            {!incidents.length && <p className="soft">{tr("Hammasi joyida.")}</p>}
          </div>
        </section>
      </div>
      <Tape feed={feed} />
    </div>
  );
}

/* signature: live receipt tape */
function Tape({ feed }) {
  const tr = useT();
  return (
    <section className="rounded-[28px] bg-[#0F3B4C] px-4 pt-4 xl:sticky xl:top-20 xl:self-start">
      <div className="mb-1 flex items-center justify-between px-1 text-[13px] font-semibold text-[#7FE9FC]"><span className="tracking-[0.16em]">{tr("MARKAZIY LENTA")}</span><Activity size={15} /></div>
      <div className="slot" />
      <div className="-mt-[7px] h-[640px] overflow-hidden px-3">
        <div className="paper paper-top h-full overflow-hidden px-4 pt-3 text-[13px]" style={{ WebkitMaskImage: "linear-gradient(#000 80%, transparent)", maskImage: "linear-gradient(#000 80%, transparent)" }}>
          <AnimatePresence initial={false}>
            {feed.slice(0, 26).map((t) => (
              <motion.div key={t.id} layout initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.45 }} className="overflow-hidden">
                <div className="dash flex items-center justify-between gap-2 py-1.5">
                  <span className="w-11 opacity-55">{fmtTime(t.date)}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{tr(providerById[t.provider].name)}</span>
                  <span className={`tnum ${t.status === "fail" ? "text-[#A62F00] line-through" : ""}`}>{fmt(t.amount)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Transactions({ feed, setFeed }) {
  const tr = useT();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const rows = feed.filter((t) => (st === "all" || t.status === st) && (!q || (providerById[t.provider].name + t.user + t.terminal).toLowerCase().includes(q.toLowerCase())));
  const refund = (id) => { setFeed((f) => f.map((t) => (t.id === id ? { ...t, status: "refund" } : t))); toast.success(tr("Mablag' qaytarildi (demo)")); };
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="surface flex flex-1 items-center gap-3 rounded-2xl border line px-4 py-3"><Search size={20} className="soft" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("Provayder, mijoz yoki terminal")} aria-label={tr("Qidirish")} className="w-full bg-transparent text-[16px] outline-none" /></div>
        <div className="surface flex rounded-2xl border line p-1">
          {[["all", "Barchasi"], ["ok", "O'tgan"], ["fail", "Xato"], ["refund", "Qaytarilgan"]].map(([k, l]) => <button key={k} onClick={() => setSt(k)} className={`focus-ring rounded-xl px-3.5 py-2 text-[14px] font-semibold ${st === k ? "bg-[var(--ink)] text-[var(--bg)]" : "soft"}`}>{tr(l)}</button>)}
        </div>
      </div>
      <div className="surface scroll-thin mt-4 overflow-x-auto rounded-[24px] border line">
        <table className="w-full min-w-[820px] text-left text-[15px]">
          <thead><tr className="border-b line text-[14px] soft">{["Vaqt", "Xizmat", "Mijoz", "Terminal", "Summa", "Holat", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h && tr(h)}</th>)}</tr></thead>
          <tbody>
            {rows.slice(0, 40).map((t) => (
              <tr key={t.id} className="border-b line last:border-0">
                <td className="tnum px-4 py-3 soft">{fmtTime(t.date)}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><ProviderMark provider={providerById[t.provider]} size={32} /><span className="font-semibold">{tr(providerById[t.provider].name)}</span></div></td>
                <td className="px-4 py-3">{t.user}</td>
                <td className="font-mono px-4 py-3 text-[14px] soft">{t.terminal}</td>
                <td className="tnum px-4 py-3 font-bold">{fmt(t.amount)}</td>
                <td className="px-4 py-3"><Pill s={t.status} /></td>
                <td className="px-4 py-3 text-right">{t.status === "ok" && <button onClick={() => refund(t.id)} className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[14px] font-semibold soft hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"><Undo2 size={15} /> {tr("Qaytarish")}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pill({ s }) {
  const tr = useT();
  const m = { ok: ["O'tdi", "var(--firuza-pale)", "var(--firuza-text)"], fail: ["Xato", "var(--brick)", "#fff"], refund: ["Qaytarildi", "var(--lemon)", "#2B2116"] }[s];
  return <span className="rounded-full px-2.5 py-1 text-[13px] font-bold" style={{ background: m[1], color: m[2] }}>{tr(m[0])}</span>;
}

function Fleet({ terminals, setTerminals }) {
  const tr = useT();
  const upd = (id, patch, msg) => { setTerminals((x) => x.map((t) => (t.id === id ? { ...t, ...patch } : t))); msg && toast.success(tr(msg)); };
  const counts = Object.keys(STATUS).map((k) => [k, terminals.filter((t) => t.status === k).length]);
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {counts.map(([k, n]) => <div key={k} className="surface flex items-center gap-2 rounded-full border line px-4 py-2 text-[14px] font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS[k][1] }} />{tr(STATUS[k][0])} · {n}</div>)}
      </div>
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {terminals.map((t) => (
          <div key={t.id} className="surface rounded-[22px] border line p-5">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[13px] soft">PN-TSH-{String(4400 + t.id).padStart(5, "0")}</div>
                <div className="truncate text-[16px] font-bold">{t.name}</div>
                <div className="text-[14px] soft">{t.district} · {tr("ish vaqti")} {t.uptime}%</div>
              </div>
              <select aria-label={tr("Holat")} value={t.status} onChange={(e) => upd(t.id, { status: e.target.value }, "Holat yangilandi")} className="focus-ring surface-2 rounded-xl px-2.5 py-1.5 text-[14px] font-semibold outline-none" style={{ color: STATUS[t.status][1] }}>
                {Object.entries(STATUS).map(([k, [l]]) => <option key={k} value={k}>{tr(l)}</option>)}
              </select>
            </div>
            <div className="mt-4 flex items-center justify-between text-[14px]"><span className="soft">{tr("Kassa to'lishi")}</span><span className={`tnum font-bold ${t.cash > 85 ? "text-[var(--brick)]" : ""}`}>{t.cash}%</span></div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full surface-2"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.cash}%`, background: t.cash > 85 ? "var(--brick)" : t.cash > 60 ? "var(--ochre)" : "var(--firuza)" }} /></div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`flex-1 text-[14px] font-semibold ${t.ping > 10 ? "text-[var(--brick)]" : "soft"}`}>{tr("Signal: {n} daq oldin", { n: t.ping })}</span>
              <button onClick={() => upd(t.id, { cash: 0, status: t.status === "naqd yo'q" ? "ishlaydi" : t.status }, "Inkassatsiya buyurildi")} className="focus-ring flex items-center gap-1.5 rounded-xl border line px-3 py-2 text-[14px] font-semibold hover:bg-[var(--surface-2)]"><Banknote size={15} /> {tr("Inkassatsiya")}</button>
              <button onClick={() => upd(t.id, { ping: 0 }, "Terminal qayta yuklandi")} aria-label={tr("Qayta yuklash")} className="focus-ring rounded-xl border line p-2 hover:bg-[var(--surface-2)]"><RotateCw size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Providers({ providerState, setProviderState }) {
  const tr = useT();
  const [cat, setCat] = useState(null);
  const set = (id, patch) => setProviderState((s) => ({ ...s, [id]: { ...s[id], ...patch } }));
  const list = PROVIDERS.filter((p) => !cat || p.cat === cat);
  const off = PROVIDERS.filter((p) => providerState[p.id]?.on === false).length;
  return (
    <div>
      <p className="text-[16px] soft">{tr("{a} ta faol, {b} ta o'chirilgan. O'zgarishlar ilovada darhol ko'rinadi.", { a: PROVIDERS.length - off, b: off })}</p>
      <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
        <button data-on={!cat} onClick={() => setCat(null)} className="chip focus-ring shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold">{tr("Hammasi")}</button>
        {CATEGORIES.map((c) => <button key={c.id} data-on={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className="chip focus-ring shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold">{tr(c.name)}</button>)}
      </div>
      <div className="surface mt-4 rounded-[24px] border line">
        {list.map((p) => {
          const s = providerState[p.id] || {};
          const on = s.on !== false;
          const fee = s.fee ?? p.fee;
          return (
            <div key={p.id} className={`flex items-center gap-4 border-b line px-5 py-3.5 last:border-0 ${on ? "" : "opacity-55"}`}>
              <ProviderMark provider={p} size={38} />
              <div className="min-w-0 flex-1"><div className="truncate text-[15px] font-bold">{tr(p.name)}</div><div className="text-[14px] soft">{tr(catById[p.cat].name)}</div></div>
              <div className="flex items-center gap-1">
                <button aria-label={tr("Komissiyani kamaytirish")} onClick={() => set(p.id, { fee: Math.max(0, +(fee - 0.5).toFixed(1)) })} className="focus-ring rounded-lg p-1.5 hover:bg-[var(--surface-2)]"><Minus size={15} /></button>
                <span className="tnum w-12 text-center text-[15px] font-bold">{fee}%</span>
                <button aria-label={tr("Komissiyani oshirish")} onClick={() => set(p.id, { fee: +(fee + 0.5).toFixed(1) })} className="focus-ring rounded-lg p-1.5 hover:bg-[var(--surface-2)]"><Plus size={15} /></button>
              </div>
              <button role="switch" aria-checked={on} aria-label={tr(p.name)} onClick={() => set(p.id, { on: !on })} className={`focus-ring relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-[var(--firuza)]" : "bg-[var(--line)]"}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Users() {
  const tr = useT();
  const [users, setUsers] = useState(ADMIN_USERS);
  const [q, setQ] = useState("");
  const rows = users.filter((u) => !q || (u.name + u.phone + u.city).toLowerCase().includes(q.toLowerCase()));
  const toggle = (id) => setUsers((x) => x.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)));
  return (
    <div>
      <div className="surface flex items-center gap-3 rounded-2xl border line px-4 py-3"><Search size={20} className="soft" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("Ism, telefon yoki shahar")} aria-label={tr("Foydalanuvchi qidirish")} className="w-full bg-transparent text-[16px] outline-none" /></div>
      <div className="surface scroll-thin mt-4 overflow-x-auto rounded-[24px] border line">
        <table className="w-full min-w-[760px] text-left text-[15px]">
          <thead><tr className="border-b line text-[14px] soft">{["Mijoz", "Shahar", "Identifikatsiya", "Balans", "To'lovlar", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h && tr(h)}</th>)}</tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className={`border-b line last:border-0 ${u.blocked ? "opacity-55" : ""}`}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--firuza-pale)] font-head text-[14px] font-bold text-[var(--firuza-text)]">{u.name.split(" ").map((w) => w[0]).join("")}</div><div><div className="font-semibold">{u.name}</div><div className="text-[14px] soft">{u.phone}</div></div></div></td>
                <td className="px-4 py-3">{tr(u.city)}</td>
                <td className="px-4 py-3"><div className="flex gap-1">{[1, 2, 3].map((l) => <span key={l} className="h-2 w-6 rounded-full" style={{ background: l <= u.kyc ? "var(--firuza)" : "var(--line)" }} />)}</div><div className="mt-1 text-[13px] soft">{tr(["", "Oddiy", "Tasdiqlangan", "To'liq"][u.kyc])}</div></td>
                <td className="tnum px-4 py-3 font-bold">{fmt(u.balance)}</td>
                <td className="tnum px-4 py-3">{u.tx}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => { toggle(u.id); toast(u.blocked ? tr("Blokdan chiqarildi") : tr("Bloklandi")); }} className={`focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[14px] font-semibold ${u.blocked ? "text-[var(--firuza-text)]" : "text-[var(--brick)]"} hover:bg-[var(--surface-2)]`}>{u.blocked ? <><ShieldCheck size={15} /> {tr("Ochish")}</> : <><Ban size={15} /> {tr("Bloklash")}</>}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
