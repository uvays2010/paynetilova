import { motion } from "framer-motion";
import { Plus, ArrowUpRight, Star, ChevronRight } from "lucide-react";
import { CATEGORIES, MONTHS, catById, fmt, fmtDate, fmtTime, providerById, PROVIDERS } from "../data";
import { Money, ProviderMark, SectionTitle } from "../ui";
import { useLang, useT } from "../i18n";

export default function HomePage({ balance, history, favorites, openPay, go, topUp }) {
  const tr = useT();
  const lang = useLang();
  const now = new Date("2026-10-22T17:45:00");
  const thisMonth = history.filter((t) => t.status === "ok" && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear());
  const lastMonth = history.filter((t) => t.status === "ok" && new Date(t.date).getMonth() === (now.getMonth() + 11) % 12);
  const spent = thisMonth.reduce((s, t) => s + t.amount, 0);
  const spentLast = lastMonth.reduce((s, t) => s + t.amount, 0);
  const diff = spentLast ? Math.round(((spent - spentLast) / spentLast) * 100) : 0;
  const popular = PROVIDERS.filter((p) => p.popular).slice(0, 8);

  return (
    <div className="space-y-10">
      {/* hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-[var(--firuza-deep)] px-6 py-8 text-white sm:px-10 sm:py-11" style={{ background: "linear-gradient(135deg, #0E6F8A 0%, #1A8FAD 55%, #32B2DA 100%)" }}>
        <div className="girih" />
        <div className="relative grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-[15px] font-semibold text-white/80">{tr("Salom, Uvays")} · {tr("Paynet hamyon")}</p>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="tnum mt-3 font-head text-[54px] font-semibold leading-[0.95] tracking-[-0.03em] sm:text-[88px]">
              {fmt(balance)}<span className="ml-3 align-top text-[22px] font-semibold text-[#FFF179] sm:text-[28px]">{tr("so'm")}</span>
            </motion.h1>
            <p className="mt-4 text-[16px] text-white/85">
              {tr("Bu oy {sum} so'm sarfladingiz", { sum: fmt(spent) })}
              <span className="mt-2 inline-block rounded-full bg-white/15 sm:ml-2 sm:mt-0 px-2.5 py-0.5 text-[14px] font-semibold">{tr("{d}% o'tgan oyga nisbatan", { d: (diff > 0 ? "+" : "") + diff })}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <button onClick={() => topUp(500000)} className="focus-ring flex items-center gap-2 justify-center rounded-2xl bg-white px-4 py-3.5 text-[15px] font-bold text-[#0F3B4C] transition hover:bg-[#FFF179]"><Plus size={18} /> {tr("To'ldirish")}</button>
            <button onClick={() => go("services")} className="focus-ring flex items-center gap-2 justify-center rounded-2xl bg-white/15 px-4 py-3.5 text-[15px] font-bold text-white ring-1 ring-white/30 transition hover:bg-white/25"><ArrowUpRight size={18} /> {tr("To'lov qilish")}</button>
          </div>
        </div>
      </section>

      {/* kiosk keypad */}
      <section>
        <SectionTitle>{tr("Nima to'laymiz?")}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <motion.button key={c.id} onClick={() => go("services", c.id)}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
              whileHover={{ y: -3 }} whileTap={{ scale: 0.97, y: 1 }}
              className="focus-ring surface group flex flex-col items-start gap-6 rounded-[22px] border line p-4 text-left shadow-[0_2px_0_var(--line)] transition">
              <span className="flex h-11 w-11 items-center justify-center rounded-[14px] text-white" style={{ background: c.color }}><c.icon size={22} /></span>
              <span className="text-[15px] font-bold leading-tight">{tr(c.name)}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-[1.25fr_1fr]">
        {/* favorites */}
        <section>
          <SectionTitle action={<button onClick={() => go("services")} className="focus-ring text-[14px] font-semibold text-[var(--firuza-text)]">{tr("Barcha xizmatlar")}</button>}>{tr("Sevimlilar")}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {favorites.map((f, i) => {
              const p = providerById[f.provider];
              return (
                <button key={i} onClick={() => openPay(f.provider, f)} className="focus-ring surface flex items-center gap-3 rounded-[20px] border line p-4 text-left transition hover:border-[var(--firuza)]">
                  <ProviderMark provider={p} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-bold">{tr(f.label)}</div>
                    <div className="truncate text-[14px] soft">{tr(p.name)} · {f.account}</div>
                  </div>
                  <div className="text-right"><div className="tnum text-[15px] font-bold">{fmt(f.amount)}</div><div className="text-[13px] soft">{tr("so'm")}</div></div>
                </button>
              );
            })}
          </div>
          <h3 className="mb-3 mt-8 flex items-center gap-2 text-[15px] font-bold soft"><Star size={16} /> {tr("Ommabop")}</h3>
          <div className="flex flex-wrap gap-2">
            {popular.map((p) => (
              <button key={p.id} onClick={() => openPay(p.id)} className="chip focus-ring flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-[14px] font-semibold transition hover:border-[var(--firuza)]">
                <ProviderMark provider={p} size={28} /> {tr(p.name)}
              </button>
            ))}
          </div>
        </section>

        {/* receipt stubs */}
        <section>
          <SectionTitle action={<button onClick={() => go("history")} className="focus-ring flex items-center text-[14px] font-semibold text-[var(--firuza-text)]">{tr("Barcha cheklar")} <ChevronRight size={16} /></button>}>{tr("So'nggi cheklar")}</SectionTitle>
          <div className="space-y-2.5">
            {history.slice(0, 5).map((t, i) => {
              const p = providerById[t.provider];
              return (
                <motion.div key={t.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  className="paper flex items-center gap-3 rounded-t-[10px] px-4 pt-3.5 text-[14px]" style={{ "--z": "6px" }}>
                  <ProviderMark provider={p} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{tr(p.name)}</div>
                    <div className="opacity-60">{fmtDate(t.date, lang)} · {fmtTime(t.date)}</div>
                  </div>
                  <div className={`tnum text-right font-semibold ${t.status === "fail" ? "text-[#A62F00] line-through" : ""}`}>−{fmt(t.amount)}</div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
