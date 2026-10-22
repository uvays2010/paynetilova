import { motion } from "framer-motion";
import { catById, fmt, providerById } from "./data";
import { useT } from "./i18n";

export function ProviderMark({ provider, size = 44 }) {
  const cat = catById[provider.cat];
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[14px] font-head font-bold text-white"
      style={{ width: size, height: size, background: cat.color, fontSize: Math.max(12, size * 0.34), letterSpacing: "-0.02em" }}
      aria-hidden
    >
      {provider.short}
    </div>
  );
}

export function Money({ value, className = "", unit = true }) {
  const tr = useT();
  return (
    <span className={`tnum ${className}`}>
      {fmt(value)}
      {unit && <span className="ml-1 text-[0.6em] font-semibold opacity-60">{tr("so'm")}</span>}
    </span>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="font-head text-[22px] font-semibold tracking-[-0.01em]">{children}</h2>
      {action}
    </div>
  );
}

/* the signature: thermal receipt */
export function Receipt({ tx, printing = false, onDone }) {
  const tr = useT();
  const p = providerById[tx.provider];
  const d = new Date(tx.date);
  const fee = Math.round((tx.amount * (p.fee || 0)) / 100);
  const code = (tx.id.replace(/\D/g, "") + "40721983").slice(0, 10).padEnd(10, "7");
  const rows = [
    [tr("Sana"), `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`],
    [tr("Vaqt"), `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`],
    [tr("Xizmat"), tr(p.name)],
    [tr(p.field), tx.account],
    [tr("Tranzaksiya"), `#${code}`],
    [tr("Terminal"), "PN-TSH-04471"],
  ];
  const content = (
    <div className="paper w-full px-6 pt-6 text-[14px] leading-[1.55]">
      <div className="text-center">
        <div className="font-head text-[20px] font-bold tracking-[0.18em]">{tr("PAYNET")}</div>
        <div className="text-[13px] opacity-70">{tr("to'lov cheki · konsept")}</div>
      </div>
      <div className="dash my-4" />
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4">
          <span className="opacity-60">{k}</span>
          <span className="truncate text-right font-semibold">{v}</span>
        </div>
      ))}
      <div className="dash my-4" />
      <div className="flex justify-between"><span className="opacity-60">{tr("Summa")}</span><span>{fmt(tx.amount)}</span></div>
      <div className="flex justify-between"><span className="opacity-60">{tr("Komissiya")}</span><span>{fmt(fee)}</span></div>
      <div className="mt-2 flex items-baseline justify-between text-[18px] font-semibold">
        <span>{tr("JAMI")}</span><span>{fmt(tx.amount + fee)} {tr("so'm")}</span>
      </div>
      <div className="dash my-4" />
      <div className="text-center text-[15px] font-semibold tracking-[0.2em]">
        {tx.status === "fail" ? "✕ " + tr("RAD ETILDI") : "✓ " + tr("MUVAFFAQIYATLI")}
      </div>
      <Barcode seed={code} />
      <div className="text-center text-[13px] opacity-60">{tr("Rahmat! Chekni saqlab qo'ying.")}</div>
    </div>
  );
  if (!printing) return content;
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)", y: -40 }}
      animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
      transition={{ duration: 2.1, ease: [0.45, 0, 0.2, 1] }}
      onAnimationComplete={onDone}
    >
      {content}
    </motion.div>
  );
}

function Barcode({ seed }) {
  const bars = [];
  let x = 0;
  for (let i = 0; i < 46; i++) {
    const n = Number(seed[i % seed.length]) || 3;
    const w = 1 + ((n + i) % 3);
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height="44" />);
    x += w + 1;
  }
  return (
    <svg viewBox={`0 0 ${x} 44`} className="mx-auto my-4 h-11 w-[78%]" preserveAspectRatio="none" fill="currentColor" aria-hidden>
      {bars}
    </svg>
  );
}
