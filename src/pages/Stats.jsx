import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Minus, Plus } from "lucide-react";
import { CATEGORIES, MONTHS, MONTHS_SHORT, catById, fmt, providerById } from "../data";
import { ProviderMark } from "../ui";
import { useLang, useT } from "../i18n";
import { MONTHS_NOM, MONTHS_SHORT_BY } from "../data";

export default function StatsPage({ history, limits, setLimits }) {
  const tr = useT();
  const lang = useLang();
  const now = new Date("2026-10-22T17:45:00");
  const months = useMemo(() => Array.from({ length: 6 }, (_, i) => { const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1); return { y: d.getFullYear(), m: d.getMonth() }; }), []);
  const [sel, setSel] = useState(5);

  const ok = history.filter((t) => t.status === "ok");
  const monthData = months.map(({ y, m }, i) => ({ i, name: MONTHS_SHORT_BY[lang][m], total: ok.filter((t) => { const d = new Date(t.date); return d.getMonth() === m && d.getFullYear() === y; }).reduce((s, t) => s + t.amount, 0) }));
  const { y, m } = months[sel];
  const inMonth = ok.filter((t) => { const d = new Date(t.date); return d.getMonth() === m && d.getFullYear() === y; });
  const total = inMonth.reduce((s, t) => s + t.amount, 0);
  const byCat = CATEGORIES.map((c) => ({ ...c, value: inMonth.filter((t) => providerById[t.provider].cat === c.id).reduce((s, t) => s + t.amount, 0) })).filter((c) => c.value > 0).sort((a, b) => b.value - a.value);
  const byProv = Object.entries(inMonth.reduce((acc, t) => ((acc[t.provider] = (acc[t.provider] || 0) + t.amount), acc), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const avg = monthData.reduce((s, x) => s + x.total, 0) / monthData.length;

  return (
    <div>
      <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Xarajatlar")}</h1>

      <section className="surface mt-6 rounded-[28px] border line p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[15px] font-semibold capitalize soft">{MONTHS_NOM[lang][m]} {y}</div>
            <div className="tnum font-head text-[48px] font-semibold leading-none tracking-[-0.02em] sm:text-[64px]">{fmt(total)}<span className="ml-2 text-[20px] soft">{tr("so'm")}</span></div>
          </div>
          <div className="text-right text-[15px]"><div className="soft">{tr("6 oylik o'rtacha")}</div><div className="tnum font-bold">{fmt(avg)} {tr("so'm")}</div></div>
        </div>
        <div className="mt-6 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} onClick={(e) => e?.activeTooltipIndex != null && setSel(Number(e.activeTooltipIndex))}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-soft)", fontSize: 14, fontWeight: 600 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "var(--surface-2)", radius: 12 }} formatter={(v) => [`${fmt(v)} ${tr("so'm")}`, tr("Sarf")]} contentStyle={{ borderRadius: 14, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: 14 }} />
              <Bar dataKey="total" radius={[12, 12, 4, 4]} style={{ cursor: "pointer" }}>
                {monthData.map((d) => <Cell key={d.i} fill={d.i === sel ? "var(--ochre)" : "var(--firuza-pale)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[14px] soft">{tr("Oyni tanlash uchun ustunni bosing.")}</p>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1.1fr]">
        <section className="surface rounded-[28px] border line p-6">
          <h2 className="font-head text-[22px] font-semibold">{tr("Yo'nalishlar bo'yicha")}</h2>
          <div className="mt-4 grid items-center gap-6 sm:grid-cols-[200px_1fr]">
            <div className="relative h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCat} dataKey="value" innerRadius={62} outerRadius={94} paddingAngle={2} stroke="none">
                    {byCat.map((c) => <Cell key={c.id} fill={c.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-head text-[24px] font-semibold">{byCat.length}</div><div className="text-[13px] soft">{tr("yo'nalish")}</div>
              </div>
            </div>
            <div className="space-y-2.5">
              {byCat.map((c) => (
                <div key={c.id} className="flex items-center gap-3 text-[15px]">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                  <span className="flex-1 font-semibold">{tr(c.name)}</span>
                  <span className="tnum soft">{Math.round((c.value / total) * 100)}%</span>
                  <span className="tnum w-[96px] text-right font-bold">{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <h3 className="mt-8 text-[15px] font-bold soft">{tr("Eng ko'p to'langan")}</h3>
          <div className="mt-3 space-y-2">
            {byProv.map(([pid, v]) => (
              <div key={pid} className="flex items-center gap-3"><ProviderMark provider={providerById[pid]} size={32} /><span className="flex-1 text-[15px] font-semibold">{tr(providerById[pid].name)}</span><span className="tnum text-[15px] font-bold">{fmt(v)}</span></div>
            ))}
          </div>
        </section>

        <section className="surface rounded-[28px] border line p-6">
          <h2 className="font-head text-[22px] font-semibold">{tr("Oylik limitlar")}</h2>
          <p className="mt-1 text-[14px] soft">{tr("Limitga yaqinlashsangiz ogohlantiramiz.")}</p>
          <div className="mt-5 space-y-5">
            {CATEGORIES.map((c) => {
              const used = inMonth.filter((t) => providerById[t.provider].cat === c.id).reduce((s, t) => s + t.amount, 0);
              const lim = limits[c.id];
              const pct = Math.min(100, (used / lim) * 100);
              const over = used > lim;
              const step = lim >= 500000 ? 100000 : 10000;
              return (
                <div key={c.id}>
                  <div className="mb-1.5 flex items-center gap-2 text-[15px]">
                    <c.icon size={17} style={{ color: c.color }} />
                    <span className="flex-1 font-semibold">{tr(c.name)}</span>
                    <span className={`tnum ${over ? "font-bold text-[var(--brick)]" : "soft"}`}>{fmt(used)} / {fmt(lim)}</span>
                    <button aria-label={tr("Limitni kamaytirish")} onClick={() => setLimits((l) => ({ ...l, [c.id]: Math.max(step, lim - step) }))} className="focus-ring rounded-lg p-1 hover:bg-[var(--surface-2)]"><Minus size={15} /></button>
                    <button aria-label={tr("Limitni oshirish")} onClick={() => setLimits((l) => ({ ...l, [c.id]: lim + step }))} className="focus-ring rounded-lg p-1 hover:bg-[var(--surface-2)]"><Plus size={15} /></button>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full surface-2">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: over ? "var(--brick)" : pct > 80 ? "var(--ochre)" : c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
