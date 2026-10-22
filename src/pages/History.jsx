import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, RotateCcw } from "lucide-react";
import { CATEGORIES, MONTHS, catById, fmt, fmtTime, providerById } from "../data";
import { ProviderMark, Receipt } from "../ui";
import { useLang, useT } from "../i18n";
import { MONTHS_NOM } from "../data";

export default function HistoryPage({ history, openPay }) {
  const tr = useT();
  const lang = useLang();
  const [cat, setCat] = useState(null);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(history[0]?.id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const list = useMemo(() => history.filter((t) => {
    const p = providerById[t.provider];
    if (cat && p.cat !== cat) return false;
    if (status !== "all" && t.status !== status) return false;
    if (q && !(p.name + " " + t.account).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [history, cat, status, q]);

  const groups = useMemo(() => {
    const g = [];
    list.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      let grp = g[g.length - 1];
      if (!grp || grp.key !== key) { grp = { key, label: `${MONTHS_NOM[lang][d.getMonth()]} ${d.getFullYear()}`, items: [], total: 0 }; g.push(grp); }
      grp.items.push(t);
      if (t.status === "ok") grp.total += t.amount;
    });
    return g;
  }, [list, lang]);

  const selected = history.find((t) => t.id === sel);

  return (
    <div>
      <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Cheklar")}</h1>
      <p className="mt-1 text-[16px] soft">{tr("Har bir to'lovning qog'oz izi. {n} ta chek.", { n: list.length })}</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="surface flex flex-1 items-center gap-3 rounded-2xl border line px-4 py-3">
          <Search size={20} className="soft" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("Provayder yoki hisob raqami")} aria-label={tr("Cheklarni qidirish")} className="w-full bg-transparent text-[16px] outline-none" />
          {q && <button onClick={() => setQ("")} aria-label={tr("Tozalash")} className="soft"><X size={18} /></button>}
        </div>
        <div className="surface flex rounded-2xl border line p-1">
          {[["all", tr("Barchasi")], ["ok", tr("O'tgan")], ["fail", tr("Rad etilgan")]].map(([k, l]) => (
            <button key={k} onClick={() => setStatus(k)} className={`focus-ring rounded-xl px-4 py-2 text-[14px] font-semibold transition ${status === k ? "bg-[var(--ink)] text-[var(--bg)]" : "soft"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
        <button data-on={!cat} onClick={() => setCat(null)} className="chip focus-ring shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold">{tr("Hammasi")}</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} data-on={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className="chip focus-ring flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{tr(c.name)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.key}>
              <div className="mb-3 flex items-baseline justify-between border-b line pb-2">
                <h2 className="font-head text-[20px] font-semibold capitalize">{g.label}</h2>
                <span className="tnum text-[14px] font-semibold soft">−{fmt(g.total)} {tr("so'm")}</span>
              </div>
              <div className="space-y-1">
                {g.items.map((t) => {
                  const p = providerById[t.provider];
                  const on = t.id === sel;
                  const d = new Date(t.date);
                  return (
                    <button key={t.id} onClick={() => { setSel(t.id); setMobileOpen(true); }}
                      className={`focus-ring flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${on ? "surface shadow-[inset_3px_0_0_var(--firuza)]" : "hover:bg-[var(--surface)]"}`}>
                      <div className="w-9 text-center"><div className="font-head text-[18px] font-semibold leading-none">{d.getDate()}</div><div className="text-[12px] soft">{fmtTime(t.date)}</div></div>
                      <ProviderMark provider={p} size={38} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-bold">{tr(p.name)}</div>
                        <div className="truncate text-[14px] soft">{tr(catById[p.cat].name)} · {t.account}</div>
                      </div>
                      <div className="text-right">
                        <div className={`tnum text-[15px] font-bold ${t.status === "fail" ? "text-[var(--brick)] line-through" : ""}`}>−{fmt(t.amount)}</div>
                        {t.status === "fail" && <div className="text-[12px] font-semibold text-[var(--brick)]">{tr("rad etildi")}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          {!groups.length && <div className="py-16 text-center font-head text-[24px] soft">{tr("Bu filtrlarda chek yo'q")}</div>}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            {selected && <ReceiptPanel tx={selected} openPay={openPay} />}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {mobileOpen && selected && (
          <motion.div className="fixed inset-0 z-50 flex items-end bg-[#06161d]/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}>
            <motion.div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-[var(--bg)] p-5" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMobileOpen(false)} className="focus-ring mb-3 ml-auto flex rounded-full p-2 surface" aria-label={tr("Yopish")}><X size={18} /></button>
              <ReceiptPanel tx={selected} openPay={openPay} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReceiptPanel({ tx, openPay }) {
  const tr = useT();
  return (
    <div>
      <motion.div key={tx.id} initial={{ y: -16, opacity: 0, rotate: -0.6 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ type: "spring", damping: 18 }}
        className="drop-shadow-[0_14px_22px_rgba(15,59,76,.18)]">
        <Receipt tx={tx} />
      </motion.div>
      <button onClick={() => openPay(tx.provider, { account: tx.account, amount: tx.amount })}
        className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--ink)] py-3.5 text-[15px] font-bold text-[var(--bg)]">
        <RotateCcw size={18} /> {tr("Yana shu to'lovni qilish")}
      </button>
    </div>
  );
}
