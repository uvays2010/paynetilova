import { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useT } from "../i18n";

const HASH = "485e37edc85acc37bfce967cbe06b9e64edf03850e988a2ecb8fc7531bc41046";

// pure-JS SHA-256: works everywhere (http, LAN IP, file://), unlike crypto.subtle
function sha256(str) {
  const K = [];
  for (let n = 2, c = 0; c < 64; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
    if (prime) { K.push((Math.cbrt(n) * 2 ** 32) | 0); c++; }
  }
  let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bytes = [...new TextEncoder().encode(str)];
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (bitLen >>> (i * 8)) & 255);
  const r = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < bytes.length; o += 64) {
    const W = [];
    for (let i = 0; i < 16; i++) W[i] = (bytes[o + i * 4] << 24) | (bytes[o + i * 4 + 1] << 16) | (bytes[o + i * 4 + 2] << 8) | bytes[o + i * 4 + 3];
    for (let i = 16; i < 64; i++) {
      const s0 = r(W[i - 15], 7) ^ r(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = r(W[i - 2], 17) ^ r(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
      const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H = H.map((v, i) => (v + [a, b, c, d, e, f, g, h][i]) | 0);
  }
  return H.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

export default function AdminLock({ onUnlock }) {
  const tr = useT();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [tries, setTries] = useState(0);
  const shake = useAnimationControls();

  const submit = (e) => {
    e.preventDefault();
    if (!pw) return;
    if (sha256(pw.trim().toLowerCase()) === HASH) return onUnlock();
    setTries((t) => t + 1);
    setErr(tr("Parol noto'g'ri"));
    setPw("");
    shake.start({ x: [0, -14, 12, -8, 6, 0], transition: { duration: 0.45 } });
  };

  return (
    <div className="flex min-h-[78vh] items-center justify-center">
      <motion.form onSubmit={submit} animate={shake} className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] p-8 text-white sm:p-10" style={{ background: "#0F3B4C" }}>
        <div className="girih opacity-60" />
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#FFF179] text-[#0F3B4C]"><Lock size={26} strokeWidth={2.4} /></div>
          <h1 className="mt-6 font-head text-[34px] font-semibold leading-tight">{tr("Admin panel")}</h1>
          <p className="mt-1 text-[15px] text-white/75">{tr("Davom etish uchun parolni kiriting.")}</p>
          <label htmlFor="admin-pw" className="sr-only">{tr("Parol")}</label>
          <div className={`mt-6 flex items-center rounded-2xl bg-white/10 ring-2 transition ${err ? "ring-[#E2622E]" : "ring-white/15 focus-within:ring-[#6AD5E8]"}`}>
            <input id="admin-pw" type={show ? "text" : "password"} autoFocus autoComplete="current-password" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(""); }} placeholder={tr("Parol")}
              className="w-full bg-transparent px-4 py-4 font-mono text-[17px] tracking-[0.12em] text-white outline-none placeholder:tracking-normal placeholder:text-white/45" />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? tr("Parolni yashirish") : tr("Parolni ko'rsatish")} className="focus-ring mr-2 rounded-xl p-2 text-white/70 hover:text-white">
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-3 min-h-[22px] text-[14px] font-semibold text-[#FF9A6B]" aria-live="polite">{err}{err && tries > 1 ? ` · ${tr("{n}-urinish", { n: tries })}` : ""}</div>
          <button type="submit" disabled={!pw} className="focus-ring mt-2 w-full rounded-2xl bg-[#32B2DA] py-4 text-[16px] font-bold text-[#06161d] transition hover:brightness-110 disabled:opacity-40">{tr("Kirish")}</button>
        </div>
      </motion.form>
    </div>
  );
}
