import { createContext, useCallback, useContext } from "react";
import { DICT } from "./dict";

export const LangContext = createContext("uz");
export const LANGS = [["uz", "O'zbek"], ["ru", "Русский"], ["en", "English"]];

export function translate(lang, s, vars) {
  let out = lang === "uz" ? s : DICT[lang]?.[s] ?? s;
  if (vars) for (const k in vars) out = out.replaceAll(`{${k}}`, vars[k]);
  return out;
}
export function useT() {
  const lang = useContext(LangContext);
  return useCallback((s, vars) => translate(lang, s, vars), [lang]);
}
export function useLang() { return useContext(LangContext); }
