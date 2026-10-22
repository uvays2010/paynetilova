import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { X, ArrowLeft, Wallet, Star, Check, Fingerprint, Delete } from "lucide-react";
import { catById, fmt } from "./data";
import { ProviderMark, Receipt } from "./ui";
import { useT } from "./i18n";

const PRESETS = { mobil: [10000, 30000, 50000, 100000], kommunal: [50000, 100000, 150000, 250000], default: [50000, 100000, 250000, 500000] };

export default function PayModal({ provider, prefill, balance, settings, onClose, onPaid, onFavorite, isFav, goHistory }) {
  const tr = useT();
  const [step, setStep] = useState("form");
  const [account, setAccount] = useState(prefill?.account || "");
  const [amount, setAmount] = useState(prefill?.amount ? String(prefill.amount) : "");
  const [tx, setTx] = useState(null);
  const [printed, setPrinted] = useState(false);
  const amt = Number(amount.replace(/\D/g, "")) || 0;
  const fee = Math.round((amt * (provider.fee || 0)) / 100);
  const total = amt + fee;
  const cat = catById[provider.cat];
  const presets = PRESETS[provider.cat] || PRESETS.default;
  const needPin = settings.pin && settings.pinCode?.length === 4;
  const needAuth = needPin || settings.bio;
  const err = useMemo(() => {
    if (!account.trim()) return tr("{field}ni kiriting", { field: tr(provider.field) });
    if (amt < 1000) return tr("Minimal summa 1 000 so'm");
    if (total > balance) return tr("Hamyonda mablag' yetarli emas");
    return null;
  }, [account, amt, total, balance, provider.field, tr]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && step !== "print" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  const pay = () => {
    const t = { id: `tx-${Date.now()}`, provider: provider.id, account: account.trim(), amount: amt, date: new Date().toISOString(), status: "ok" };
    setTx(t);
    setStep("print");
    onPaid(t, total);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[#06161d]/60 backdrop-blur-[3px]" onClick={() => step !== "print" && onClose()} />
      <motion.div
        role="dialog" aria-modal="true" aria-label={tr(provider.name)}
        className="surface relative max-h-[94vh] w-full max-w-[460px] overflow-y-auto rounded-t-[28px] shadow-2xl sm:rounded-[28px] scroll-thin"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 260 }}
      >
        <div className="flex items-center gap-3 px-6 pt-6">
          {(step === "confirm" || step === "auth") && (
            <button className="focus-ring -ml-2 rounded-full p-2 hover:bg-[var(--surface-2)]" onClick={() => setStep(step === "auth" ? "confirm" : "form")} aria-label={tr("Orqaga")}><ArrowLeft size={20} /></button>
          )}
          <ProviderMark provider={provider} size={44} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-head text-[19px] font-semibold">{tr(provider.name)}</div>
            <div className="text-[14px] soft">{tr(cat.name)} · {provider.fee ? tr("komissiya {n}%", { n: provider.fee }) : tr("komissiyasiz")}</div>
          </div>
          {step !== "print" && (
            <button className="focus-ring rounded-full p-2 hover:bg-[var(--surface-2)]" onClick={onClose} aria-label={tr("Yopish")}><X size={20} /></button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" className="px-6 pb-6 pt-6" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <label className="block text-[14px] font-semibold soft" htmlFor="acc">{tr(provider.field)}</label>
              <input id="acc" autoFocus value={account} onChange={(e) => setAccount(e.target.value)}
                placeholder={provider.field.includes("Telefon") ? "+998 90 000 00 00" : tr("Kiriting")}
                className="focus-ring surface-2 mt-2 w-full rounded-2xl px-4 py-3.5 text-[17px] outline-none" />

              <label className="mt-6 block text-[14px] font-semibold soft" htmlFor="amt">{tr("Summa")}</label>
              <div className="surface-2 mt-2 flex items-baseline rounded-2xl px-4 py-2">
                <input id="amt" inputMode="numeric" value={amt ? fmt(amt) : ""} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                  className="tnum w-full bg-transparent font-head text-[38px] font-semibold outline-none" />
                <span className="font-semibold soft">{tr("so'm")}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {presets.map((v) => (
                  <button key={v} onClick={() => setAmount(String(v))} data-on={amt === v} className="chip focus-ring tnum rounded-full px-4 py-2 text-[14px] font-semibold">{fmt(v)}</button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border line px-4 py-3">
                <Wallet size={20} className="text-[var(--firuza-text)]" />
                <div className="flex-1 text-[14px]"><div className="font-semibold">{tr("Paynet hamyon")}</div><div className="soft">{tr("Mavjud")}: {fmt(balance)} {tr("so'm")}</div></div>
              </div>

              <div className="mt-4 min-h-[22px] text-[14px] font-semibold text-[var(--brick)]" aria-live="polite">{(account || amt) ? err : ""}</div>
              <button disabled={!!err} onClick={() => setStep("confirm")}
                className="focus-ring mt-2 w-full rounded-2xl bg-[var(--ink)] py-4 text-[16px] font-bold text-[var(--bg)] transition disabled:opacity-35">
                {tr("Davom etish")}
              </button>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" className="px-6 pb-6 pt-6" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
              <div className="text-[14px] font-semibold soft">{tr("To'lanadi")}</div>
              <div className="tnum font-head text-[52px] font-semibold leading-none tracking-[-0.02em]">{fmt(total)}<span className="ml-2 text-[20px] soft">{tr("so'm")}</span></div>
              <div className="mt-6 space-y-3 text-[15px]">
                {[[tr(provider.field), account], [tr("Summa"), `${fmt(amt)} ${tr("so'm")}`], [tr("Komissiya"), `${fmt(fee)} ${tr("so'm")}`], [tr("Manba"), tr("Paynet hamyon")], [tr("To'lovdan keyin qoladi"), `${fmt(balance - total)} ${tr("so'm")}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b line pb-3"><span className="soft">{k}</span><span className="text-right font-semibold">{v}</span></div>
                ))}
              </div>
              <button onClick={() => (needAuth ? setStep("auth") : pay())} className="focus-ring mt-6 w-full rounded-2xl bg-[var(--firuza)] py-4 text-[16px] font-bold text-white shadow-[0_8px_24px_-8px_var(--firuza)] transition hover:brightness-110">
                {tr("To'lash")} · {fmt(total)} {tr("so'm")}
              </button>
              <p className="mt-3 text-center text-[14px] soft">{tr("Konsept rejimi: haqiqiy pul yechilmaydi.")}</p>
            </motion.div>
          )}

          {step === "auth" && (
            <motion.div key="auth" className="px-6 pb-6 pt-6" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
              {needPin ? <PinPad code={settings.pinCode} onOk={pay} bio={settings.bio} /> : <HoldToPay onOk={pay} />}
            </motion.div>
          )}

          {step === "print" && tx && (
            <motion.div key="print" className="px-6 pb-6 pt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="rounded-[22px] bg-[#0F3B4C] px-4 pb-0 pt-4">
                <div className="mb-1 flex items-center justify-between px-1 text-[13px] font-semibold text-[#7FE9FC]">
                  <span className="tracking-[0.16em]">PN-TSH-04471</span>
                  <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${printed ? "bg-[#6AD5E8]" : "animate-pulse bg-[#FFF179]"}`} />{printed ? tr("tayyor") : tr("chop etilmoqda")}</span>
                </div>
                <div className="slot" />
                <div className="-mt-[7px] px-3">
                  <Receipt tx={tx} printing onDone={() => setPrinted(true)} />
                </div>
              </div>
              <AnimatePresence>
                {printed && (
                  <motion.div className="mt-5 grid grid-cols-2 gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => onFavorite({ provider: provider.id, account: tx.account, amount: tx.amount })}
                      className="focus-ring flex items-center justify-center gap-2 rounded-2xl border line py-3.5 text-[15px] font-semibold">
                      {isFav(provider.id, tx.account) ? <><Check size={18} /> {tr("Saqlangan")}</> : <><Star size={18} /> {tr("Sevimlilarga")}</>}
                    </button>
                    <button onClick={onClose} className="focus-ring rounded-2xl bg-[var(--ink)] py-3.5 text-[15px] font-bold text-[var(--bg)]">{tr("Tayyor")}</button>
                    <button onClick={goHistory} className="focus-ring col-span-2 py-1 text-[14px] font-semibold text-[var(--firuza-text)] underline-offset-4 hover:underline">{tr("Barcha cheklar tarixda")}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function PinPad({ code, onOk, bio }) {
  const tr = useT();
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);
  const [useBio, setUseBio] = useState(false);
  const shake = useAnimationControls();
  const pinRef = useRef("");
  const update = (v) => { pinRef.current = v; setPin(v); };
  const press = (d) => {
    if (pinRef.current.length >= 4) return;
    const next = pinRef.current + d;
    setBad(false);
    update(next);
    if (next.length === 4) {
      if (next === code) setTimeout(onOk, 180);
      else { setBad(true); shake.start({ x: [0, -12, 10, -6, 4, 0], transition: { duration: 0.4 } }); setTimeout(() => update(""), 450); }
    }
  };
  useEffect(() => {
    const k = (e) => { if (/^\d$/.test(e.key)) press(e.key); if (e.key === "Backspace") update(pinRef.current.slice(0, -1)); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  if (useBio) return <HoldToPay onOk={onOk} />;
  return (
    <div className="text-center">
      <div className="font-head text-[22px] font-semibold">{tr("PIN-kodni kiriting")}</div>
      <motion.div animate={shake} className="mt-5 flex justify-center gap-4" aria-live="polite" aria-label={tr("{n} ta raqam kiritildi", { n: pin.length })}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-4 w-4 rounded-full transition" style={{ background: i < pin.length ? (bad ? "var(--brick)" : "var(--ink)") : "var(--line)" }} />
        ))}
      </motion.div>
      <div className="mt-2 min-h-[22px] text-[14px] font-semibold text-[var(--brick)]">{bad ? tr("PIN noto'g'ri") : ""}</div>
      <div className="mx-auto mt-2 grid max-w-[280px] grid-cols-3 gap-2.5">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} onClick={() => press(d)} className="focus-ring surface-2 rounded-2xl py-3.5 font-head text-[24px] font-semibold active:scale-95">{d}</button>
        ))}
        {bio ? (
          <button onClick={() => setUseBio(true)} aria-label={tr("Barmoq izi")} className="focus-ring flex items-center justify-center rounded-2xl text-[var(--firuza-text)]"><Fingerprint size={26} /></button>
        ) : <span />}
        <button onClick={() => press("0")} className="focus-ring surface-2 rounded-2xl py-3.5 font-head text-[24px] font-semibold active:scale-95">0</button>
        <button onClick={() => update(pinRef.current.slice(0, -1))} aria-label={tr("O'chirish")} className="focus-ring flex items-center justify-center rounded-2xl soft"><Delete size={24} /></button>
      </div>
    </div>
  );
}

function HoldToPay({ onOk }) {
  const tr = useT();
  const [p, setP] = useState(0);
  const raf = useRef(null);
  const start = useRef(0);
  const begin = () => {
    start.current = performance.now();
    const loop = (now) => {
      const v = Math.min(1, (now - start.current) / 900);
      setP(v);
      if (v >= 1) { onOk(); return; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };
  const end = () => { cancelAnimationFrame(raf.current); setP((v) => (v >= 1 ? v : 0)); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <div className="py-4 text-center">
      <div className="font-head text-[22px] font-semibold">{tr("Barmoq izi bilan tasdiqlang")}</div>
      <p className="mt-1 text-[14px] soft">{tr("Tugmani bosib turing")}</p>
      <button onMouseDown={begin} onMouseUp={end} onMouseLeave={end} onTouchStart={(e) => { e.preventDefault(); begin(); }} onTouchEnd={end}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && begin()} onKeyUp={end}
        aria-label={tr("Barmoq izi")} className="focus-ring relative mx-auto mt-6 flex h-28 w-28 select-none items-center justify-center rounded-full surface-2">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 112 112" aria-hidden>
          <circle cx="56" cy="56" r="52" fill="none" stroke="var(--firuza)" strokeWidth="5" strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - p)} strokeLinecap="round" />
        </svg>
        <Fingerprint size={52} className="text-[var(--firuza-text)]" style={{ opacity: 0.5 + p * 0.5 }} />
      </button>
    </div>
  );
}
