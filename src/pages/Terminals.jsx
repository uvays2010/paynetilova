import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Banknote, Navigation } from "lucide-react";
import { useT } from "../i18n";

export default function TerminalsPage({ terminals: TERMINALS }) {
  const tr = useT();
  const [h24, setH24] = useState(false);
  const [cash, setCash] = useState(false);
  const [sel, setSel] = useState(3);
  const list = useMemo(() => TERMINALS.filter((t) => (!h24 || t.h24) && (!cash || t.cashin)), [h24, cash, TERMINALS]);
  const me = { x: 50, y: 54 };
  const dist = (t) => (Math.hypot(t.x - me.x, t.y - me.y) * 0.28).toFixed(1);
  const sorted = [...list].sort((a, b) => dist(a) - dist(b));
  const s = TERMINALS.find((t) => t.id === sel);

  return (
    <div>
      <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Terminallar")}</h1>
      <p className="mt-1 text-[16px] soft">{tr("Toshkent bo'ylab yaqin Paynet nuqtalari.")}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button data-on={h24} onClick={() => setH24(!h24)} className="chip focus-ring flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"><Clock size={16} /> 24/7</button>
        <button data-on={cash} onClick={() => setCash(!cash)} className="chip focus-ring flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"><Banknote size={16} /> {tr("Naqd qabul qiladi")}</button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[28px] border line" style={{ background: "var(--surface-2)" }}>
          <svg viewBox="0 0 100 100" className="block aspect-square w-full xl:aspect-auto xl:h-[640px]" preserveAspectRatio="xMidYMid slice" role="img" aria-label={tr("Toshkent xaritasi")}>
            <defs>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="var(--line)" strokeWidth=".15" /></pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            {/* city outline */}
            <path d="M12 30 C 18 12, 44 6, 62 9 C 84 12, 94 30, 92 52 C 90 76, 76 94, 52 94 C 28 94, 8 80, 8 58 C 8 46, 9 38, 12 30 Z" fill="var(--surface)" stroke="var(--line)" strokeWidth=".6" />
            {/* ring roads */}
            <ellipse cx="50" cy="52" rx="34" ry="32" fill="none" stroke="var(--line)" strokeWidth="1.4" />
            <ellipse cx="50" cy="50" rx="17" ry="16" fill="none" stroke="var(--line)" strokeWidth="1" />
            <path d="M50 8 L50 94 M8 52 L92 52 M20 22 L80 84 M80 20 L22 84" stroke="var(--line)" strokeWidth=".7" />
            {/* Ankhor canal / Bozsuv */}
            <path d="M18 10 C 30 26, 34 36, 44 44 S 58 60, 64 72 S 74 88, 82 96" fill="none" stroke="var(--firuza)" strokeOpacity=".45" strokeWidth="1.8" strokeLinecap="round" />
            <text x="66" y="77" fontSize="2.6" fill="var(--firuza)" fontWeight="600" fontFamily="Open Sans">{tr("Anhor")}</text>
            {/* me */}
            <circle cx={me.x} cy={me.y} r="4" fill="var(--firuza)" opacity=".15"><animate attributeName="r" values="2;6;2" dur="3s" repeatCount="indefinite" /></circle>
            <circle cx={me.x} cy={me.y} r="1.6" fill="var(--firuza)" stroke="#fff" strokeWidth=".6" />
            {list.map((t) => {
              const on = t.id === sel;
              const c = t.status === "ishlaydi" ? "var(--ink)" : "var(--brick)";
              return (
                <g key={t.id} onClick={() => setSel(t.id)} style={{ cursor: "pointer" }} role="button" aria-label={t.name} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSel(t.id)}>
                  {on && <circle cx={t.x} cy={t.y} r="4.4" fill="none" stroke="var(--ochre)" strokeWidth=".7"><animate attributeName="r" values="3;5.5;3" dur="2.4s" repeatCount="indefinite" /></circle>}
                  <rect x={t.x - 2} y={t.y - 2.6} width="4" height="5.2" rx="1" fill={on ? "var(--ochre)" : c} />
                  <rect x={t.x - 1.2} y={t.y - 1.8} width="2.4" height="1.6" rx=".3" fill="#C3F4F6" />
                </g>
              );
            })}
          </svg>
          {s && (
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="surface absolute inset-x-4 bottom-4 flex items-center gap-4 rounded-2xl p-4 shadow-xl sm:left-auto sm:w-[340px]">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[16px] font-bold">{s.name}</div>
                <div className="text-[14px] soft">{s.district} · {dist(s)} {tr("km")}</div>
                <div className={`mt-1 text-[14px] font-semibold ${s.status === "ishlaydi" ? "text-[var(--firuza-text)]" : "text-[var(--brick)]"}`}>{s.status === "ishlaydi" ? tr("Ishlaydi") + (s.h24 ? " · 24/7" : " · 08:00–22:00") : tr(s.status)}</div>
              </div>
              <button className="focus-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ink)] text-[var(--bg)]" aria-label={tr("Yo'nalish")}><Navigation size={20} /></button>
            </motion.div>
          )}
        </div>

        <div className="scroll-thin space-y-2 xl:max-h-[640px] xl:overflow-y-auto xl:pr-1">
          {sorted.map((t) => (
            <button key={t.id} onClick={() => setSel(t.id)} className={`focus-ring flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${t.id === sel ? "border-[var(--ochre)] surface" : "line hover:bg-[var(--surface)]"}`}>
              <div className="w-14 text-center"><div className="tnum font-head text-[20px] font-semibold leading-none">{dist(t)}</div><div className="text-[12px] soft">{tr("km")}</div></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold">{t.name}</div>
                <div className="text-[14px] soft">{t.district}</div>
              </div>
              <div className="flex flex-col items-end gap-1 text-[12px] font-semibold">
                {t.h24 && <span className="rounded-full bg-[var(--firuza-pale)] px-2 py-0.5 text-[var(--firuza-deep)]">24/7</span>}
                {t.status !== "ishlaydi" && <span className="rounded-full bg-[var(--brick)] px-2 py-0.5 text-white">{tr(t.status)}</span>}
              </div>
            </button>
          ))}
          {!sorted.length && <p className="py-10 text-center soft">{tr("Bunday terminal topilmadi")}</p>}
        </div>
      </div>
    </div>
  );
}
