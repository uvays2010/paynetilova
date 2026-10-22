import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PROVIDERS, fmt, providerById } from "../data";
import { ProviderMark } from "../ui";
import { useLang, useT } from "../i18n";
import { DAYS_BY } from "../data";

const RULES = ["Har oyning 1-sanasi", "Har oyning 10-sanasi", "Har oyning 25-sanasi", "Har dushanba", "Balans 5 000 so'mdan tushsa"];

function nextDates(rule) {
  const start = new Date("2026-10-22T00:00:00");
  const out = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const m = rule.match(/(\d+)-sanasi/);
    if (m && d.getDate() === Number(m[1])) out.push(i);
    if (rule === "Har dushanba" && d.getDay() === 1) out.push(i);
  }
  return out;
}

export default function AutopayPage({ autopay, setAutopay }) {
  const tr = useT();
  const lang = useLang();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ provider: "ucell", account: "", amount: 30000, rule: RULES[0] });
  const start = new Date("2026-10-22T00:00:00");
  const strip = Array.from({ length: 14 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const active = autopay.filter((a) => a.on);
  const monthly = active.reduce((s, a) => s + a.amount * (a.rule === "Har dushanba" ? 4 : 1), 0);

  const add = () => {
    if (!form.account.trim()) return toast.error(tr("Hisob raqamini kiriting"));
    setAutopay((x) => [...x, { ...form, id: `a${Date.now()}`, on: true }]);
    setAdding(false); setForm({ ...form, account: "" });
    toast.success(tr("Avtoto'lov yoqildi"));
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Avtoto'lov")}</h1>
          <p className="mt-1 text-[16px] soft">{tr("{n} ta faol qoida · oyiga taxminan", { n: active.length })} <b className="tnum text-[var(--ink)]">{fmt(monthly)} {tr("so'm")}</b></p>
        </div>
        <button onClick={() => setAdding(true)} className="focus-ring flex items-center gap-2 rounded-2xl bg-[var(--ink)] px-5 py-3.5 text-[15px] font-bold text-[var(--bg)]"><Plus size={18} /> {tr("Yangi qoida")}</button>
      </div>

      <section className="surface mt-8 rounded-[28px] border line p-5">
        <h2 className="mb-4 text-[15px] font-bold soft">{tr("Keyingi 14 kun")}</h2>
        <div className="scroll-thin grid grid-flow-col gap-2 overflow-x-auto" style={{ gridAutoColumns: "minmax(64px,1fr)" }}>
          {strip.map((d, i) => {
            const due = active.filter((a) => nextDates(a.rule).includes(i));
            return (
              <div key={i} className={`flex min-h-[118px] flex-col items-center rounded-2xl px-1 py-3 ${i === 0 ? "bg-[var(--ink)] text-[var(--bg)]" : "surface-2"}`}>
                <div className="text-[12px] font-semibold opacity-70">{DAYS_BY[lang][d.getDay()]}</div>
                <div className="font-head text-[22px] font-semibold">{d.getDate()}</div>
                <div className="mt-2 flex flex-col gap-1">
                  {due.map((a) => <ProviderMark key={a.id} provider={providerById[a.provider]} size={26} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {autopay.map((a) => {
          const p = providerById[a.provider];
          return (
            <motion.div layout key={a.id} className={`surface flex items-center gap-4 rounded-[22px] border line p-5 transition ${a.on ? "" : "opacity-60"}`}>
              <ProviderMark provider={p} size={48} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[16px] font-bold">{tr(p.name)}</div>
                <div className="truncate text-[14px] soft">{a.account}</div>
                <div className="mt-1 text-[14px] font-semibold text-[var(--firuza-text)]">{tr(a.rule)}</div>
              </div>
              <div className="text-right">
                <div className="tnum font-head text-[20px] font-semibold">{fmt(a.amount)}</div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button aria-label={tr("O'chirish")} onClick={() => setAutopay((x) => x.filter((y) => y.id !== a.id))} className="focus-ring rounded-lg p-1.5 soft hover:text-[var(--brick)]"><Trash2 size={17} /></button>
                  <button role="switch" aria-checked={a.on} aria-label={tr("Avtoto'lov") + ": " + tr(p.name)} onClick={() => setAutopay((x) => x.map((y) => (y.id === a.id ? { ...y, on: !y.on } : y)))}
                    className={`focus-ring relative h-7 w-12 rounded-full transition ${a.on ? "bg-[var(--firuza)]" : "bg-[var(--line)]"}`}>
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${a.on ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-[#06161d]/60 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(false)}>
            <motion.div role="dialog" aria-label={tr("Yangi avtoto'lov")} className="surface w-full max-w-[440px] rounded-t-[28px] p-6 sm:rounded-[28px]" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="font-head text-[24px] font-semibold">{tr("Yangi qoida")}</h2><button onClick={() => setAdding(false)} aria-label={tr("Yopish")} className="focus-ring rounded-full p-2"><X size={20} /></button></div>
              <label className="mt-5 block text-[14px] font-semibold soft" htmlFor="ap-p">{tr("Xizmat")}</label>
              <select id="ap-p" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="focus-ring surface-2 mt-2 w-full rounded-2xl px-4 py-3.5 text-[16px] outline-none">
                {PROVIDERS.map((p) => <option key={p.id} value={p.id}>{tr(p.name)}</option>)}
              </select>
              <label className="mt-4 block text-[14px] font-semibold soft" htmlFor="ap-a">{tr(providerById[form.provider].field)}</label>
              <input id="ap-a" value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} className="focus-ring surface-2 mt-2 w-full rounded-2xl px-4 py-3.5 text-[16px] outline-none" />
              <label className="mt-4 block text-[14px] font-semibold soft" htmlFor="ap-s">{tr("Summa")}</label>
              <input id="ap-s" inputMode="numeric" value={fmt(form.amount)} onChange={(e) => setForm({ ...form, amount: Number(e.target.value.replace(/\D/g, "")) || 0 })} className="tnum focus-ring surface-2 mt-2 w-full rounded-2xl px-4 py-3.5 text-[16px] outline-none" />
              <div className="mt-4 text-[14px] font-semibold soft">{tr("Qachon")}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {RULES.map((r) => <button key={r} data-on={form.rule === r} onClick={() => setForm({ ...form, rule: r })} className="chip focus-ring rounded-full px-3.5 py-2 text-[14px] font-semibold">{tr(r)}</button>)}
              </div>
              <button onClick={add} className="focus-ring mt-6 w-full rounded-2xl bg-[var(--firuza)] py-4 text-[16px] font-bold text-white">{tr("Yoqish")}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
