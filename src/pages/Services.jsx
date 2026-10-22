import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { CATEGORIES, PROVIDERS, catById } from "../data";
import { ProviderMark } from "../ui";
import { useT } from "../i18n";

export default function ServicesPage({ openPay, catFilter, providerState }) {
  const tr = useT();
  const [cat, setCat] = useState(catFilter);
  const [q, setQ] = useState("");
  const list = useMemo(() => PROVIDERS.filter((p) => providerState[p.id]?.on !== false && (!cat || p.cat === cat) && (!q || (p.name + " " + tr(p.name)).toLowerCase().includes(q.toLowerCase()))), [cat, q, providerState, tr]);
  const grouped = useMemo(() => CATEGORIES.map((c) => ({ c, items: list.filter((p) => p.cat === c.id) })).filter((g) => g.items.length), [list]);

  return (
    <div>
      <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Xizmatlar")}</h1>
      <p className="mt-1 text-[16px] soft">{tr("{p} ta provayder, {c} ta yo'nalish. Bitta hamyondan.", { p: PROVIDERS.length, c: CATEGORIES.length })}</p>

      <div className="sticky top-0 z-20 -mx-4 mt-6 bg-[var(--bg)] px-4 pb-3 pt-2 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="surface flex items-center gap-3 rounded-2xl border line px-4 py-3">
          <Search size={20} className="soft" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("Beeline, gaz, jarima, kontrakt…")} aria-label={tr("Qidirish")} className="w-full bg-transparent text-[16px] outline-none" />
          {q && <button onClick={() => setQ("")} aria-label={tr("Tozalash")} className="focus-ring rounded-full p-1 soft"><X size={18} /></button>}
        </div>
        <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
          <button data-on={!cat} onClick={() => setCat(null)} className="chip focus-ring shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold">{tr("Barchasi")}</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} data-on={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className="chip focus-ring flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{tr(c.name)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-10">
        <AnimatePresence mode="popLayout">
          {grouped.map(({ c, items }) => (
            <motion.section key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: c.color }}><c.icon size={18} /></span>
                <h2 className="font-head text-[22px] font-semibold">{tr(c.name)}</h2>
                <span className="text-[14px] font-semibold soft">{items.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {items.map((p) => (
                  <motion.button layout key={p.id} onClick={() => openPay(p.id)} whileTap={{ scale: 0.98 }}
                    className="focus-ring surface flex items-center gap-3 rounded-[20px] border line p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--firuza)]">
                    <ProviderMark provider={p} />
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-bold">{tr(p.name)}</div>
                      <div className="truncate text-[14px] soft">{p.fee ? tr("komissiya {n}%", { n: p.fee }) : tr("Komissiyasiz")}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
        {!grouped.length && (
          <div className="py-20 text-center">
            <div className="font-head text-[28px] font-semibold">{tr("«{q}» topilmadi", { q })}</div>
            <p className="mt-2 soft">{tr("Boshqacha yozib ko'ring yoki yo'nalishni o'zgartiring.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
