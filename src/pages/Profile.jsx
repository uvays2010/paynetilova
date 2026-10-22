import { useState } from "react";
import { toast } from "sonner";
import { Bell, MessageSquare, ShieldCheck, Fingerprint, Languages, Moon, Gift, KeyRound, RotateCcw, Gauge } from "lucide-react";
import { fmt } from "../data";
import { LANGS, translate, useT } from "../i18n";

function Switch({ on, onChange, label }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`focus-ring relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-[var(--firuza)]" : "bg-[var(--line)]"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl px-4 py-4">
      <Icon size={20} className="text-[var(--firuza-text)]" />
      <div className="min-w-[160px] flex-1"><div className="text-[15px] font-bold">{title}</div><div className="text-[14px] soft">{desc}</div></div>
      {children}
    </div>
  );
}

export default function ProfilePage({ history, theme, setTheme, lang, setLang, settings, setSettings, resetAll, go }) {
  const tr = useT();
  const [pinDraft, setPinDraft] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const ok = history.filter((t) => t.status === "ok");
  const cashback = Math.round(ok.reduce((x, t) => x + t.amount, 0) * 0.005);
  const set = (k, v, msg) => { setSettings((s) => ({ ...s, [k]: v })); if (msg) toast.success(msg); };

  const togglePin = (v) => {
    if (v && settings.pinCode?.length !== 4) { setSettings((s) => ({ ...s, pin: true })); return; }
    set("pin", v, v ? tr("PIN-kod yoqildi") : tr("PIN-kod o'chirildi"));
  };
  const savePin = () => {
    if (!/^\d{4}$/.test(pinDraft)) return toast.error(tr("PIN 4 ta raqamdan iborat bo'lishi kerak"));
    setSettings((s) => ({ ...s, pin: true, pinCode: pinDraft }));
    setPinDraft("");
    toast.success(tr("PIN-kod saqlandi"));
  };

  return (
    <div className="max-w-[920px]">
      <h1 className="font-head text-[40px] font-semibold leading-tight tracking-[-0.02em] sm:text-[52px]">{tr("Sozlamalar")}</h1>

      <section className="relative mt-6 overflow-hidden rounded-[32px] p-7 text-white sm:p-9" style={{ background: "#0F3B4C" }}>
        <div className="girih opacity-70" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#FFF179] font-head text-[30px] font-bold text-[#0F3B4C]">UE</div>
          <div className="flex-1">
            <div className="font-head text-[30px] font-semibold leading-tight">Uvays Eshboyev</div>
            <p className="text-[15px] text-white/75">+998 90 123 45 67 · {tr("Toshkent")}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/20">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#7FE9FC]"><Gift size={16} /> {tr("Keshbek")}</div>
            <div className="tnum font-head text-[26px] font-semibold">{fmt(cashback)} {tr("so'm")}</div>
          </div>
        </div>
      </section>

      <h2 className="mb-3 mt-9 font-head text-[22px] font-semibold">{tr("Ko'rinish")}</h2>
      <section className="surface rounded-[28px] border line p-2">
        <Row icon={Languages} title={tr("Til")} desc={tr("Butun ilova shu tilda ko'rinadi")}>
          <div className="surface-2 flex rounded-xl p-1" role="group" aria-label={tr("Til")}>
            {LANGS.map(([k, l]) => (
              <button key={k} aria-pressed={lang === k} onClick={() => { setLang(k); toast.success(translate(k, "Til o'zgartirildi")); }} className={`focus-ring rounded-lg px-3 py-1.5 text-[14px] font-semibold ${lang === k ? "bg-[var(--ink)] text-[var(--bg)]" : "soft"}`}>{l}</button>
            ))}
          </div>
        </Row>
        <Row icon={Moon} title={tr("Tungi rejim")} desc={tr("Ko'z uchun yengil")}>
          <Switch on={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} label={tr("Tungi rejim")} />
        </Row>
      </section>

      <h2 className="mb-3 mt-9 font-head text-[22px] font-semibold">{tr("Bildirishnomalar")}</h2>
      <section className="surface rounded-[28px] border line p-2">
        <Row icon={Bell} title={tr("Push-bildirishnomalar")} desc={tr("Har bir to'lovdan keyin xabar")}>
          <Switch on={settings.push} onChange={(v) => set("push", v)} label={tr("Push-bildirishnomalar")} />
        </Row>
        <Row icon={MessageSquare} title={tr("SMS xabarlar")} desc={tr("Hamyondan pul yechilganda")}>
          <Switch on={settings.sms} onChange={(v) => set("sms", v)} label={tr("SMS xabarlar")} />
        </Row>
        <Row icon={Gauge} title={tr("Limit ogohlantirishlari")} desc={tr("Oylik limitning 80% iga yetganda")}>
          <button onClick={() => go("stats")} className="focus-ring text-[14px] font-semibold text-[var(--firuza-text)]">{tr("Limitlar")}</button>
          <Switch on={settings.limit} onChange={(v) => set("limit", v)} label={tr("Limit ogohlantirishlari")} />
        </Row>
      </section>

      <h2 className="mb-3 mt-9 font-head text-[22px] font-semibold">{tr("Xavfsizlik")}</h2>
      <section className="surface rounded-[28px] border line p-2">
        <Row icon={KeyRound} title={tr("PIN-kod")} desc={settings.pin && settings.pinCode ? tr("Har bir to'lov PIN bilan tasdiqlanadi") : tr("To'lovlarni 4 xonali kod bilan tasdiqlash")}>
          <Switch on={settings.pin} onChange={togglePin} label={tr("PIN-kod")} />
        </Row>
        {settings.pin && (
          <div className="mx-4 mb-3 flex flex-wrap items-center gap-3 rounded-2xl surface-2 p-4">
            <label htmlFor="pin-new" className="text-[14px] font-semibold">{settings.pinCode ? tr("PIN-kodni o'zgartirish") : tr("Yangi PIN-kod o'rnating")}</label>
            <input id="pin-new" inputMode="numeric" maxLength={4} value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••" type="password" autoComplete="new-password"
              className="focus-ring surface w-[120px] rounded-xl px-4 py-2.5 text-center font-mono text-[18px] tracking-[0.4em] outline-none" />
            <button onClick={savePin} className="focus-ring rounded-xl bg-[var(--ink)] px-4 py-2.5 text-[14px] font-bold text-[var(--bg)]">{tr("Saqlash")}</button>
            {!settings.pinCode && <span className="w-full text-[14px] text-[var(--brick)]">{tr("PIN o'rnatilmaguncha to'lovlar PIN so'ramaydi")}</span>}
          </div>
        )}
        <Row icon={Fingerprint} title={tr("Barmoq izi / Face ID")} desc={tr("To'lovni barmoq izi bilan tasdiqlash")}>
          <Switch on={settings.bio} onChange={(v) => set("bio", v, v ? tr("Barmoq izi yoqildi") : null)} label={tr("Barmoq izi / Face ID")} />
        </Row>
        <Row icon={ShieldCheck} title={tr("Admin panel")} desc={tr("Parol bilan himoyalangan")}>
          <button onClick={() => go("admin")} className="focus-ring text-[14px] font-semibold text-[var(--firuza-text)]">{tr("Ochish")}</button>
        </Row>
      </section>

      <h2 className="mb-3 mt-9 font-head text-[22px] font-semibold">{tr("Ma'lumotlar")}</h2>
      <section className="surface rounded-[28px] border line p-2">
        <Row icon={RotateCcw} title={tr("Hammasini tiklash")} desc={tr("Balans, cheklar va sozlamalar boshlang'ich holatga qaytadi")}>
          {confirmReset ? (
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="focus-ring rounded-xl border line px-4 py-2 text-[14px] font-semibold">{tr("Bekor qilish")}</button>
              <button onClick={resetAll} className="focus-ring rounded-xl bg-[var(--brick)] px-4 py-2 text-[14px] font-bold text-white">{tr("Ha, tiklash")}</button>
            </div>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="focus-ring rounded-xl border line px-4 py-2 text-[14px] font-semibold text-[var(--brick)]">{tr("Tiklash")}</button>
          )}
        </Row>
      </section>
      <p className="mt-6 text-[14px] soft">{tr("Barcha sozlamalar shu brauzerda saqlanadi.")} {tr("Mustaqil dizayn konsepti. Paynet bilan rasmiy aloqasi yo'q, haqiqiy to'lov amalga oshmaydi.")}</p>
    </div>
  );
}
