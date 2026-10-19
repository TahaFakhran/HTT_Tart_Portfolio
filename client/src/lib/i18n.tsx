import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "../types";
import en from "../locales/en";
import fr from "../locales/fr";

const dictionaries = { en, fr } as const;
type TranslationKey = keyof typeof en;
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => undefined,
  t: (key) => en[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    localStorage.getItem("portfolio-language") === "fr" ? "fr" : "en",
  );

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("portfolio-language", nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => dictionaries[language][key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function translateCategory(
  category: string,
  t: (key: TranslationKey) => string,
) {
  const keys: Record<string, TranslationKey> = {
    Illustration: "categoryIllustration",
    Animation: "categoryAnimation",
    "Digital Art": "categoryDigitalArt",
    Studies: "categoryStudies",
    "Character Design": "categoryCharacterDesign",
  };
  return keys[category] ? t(keys[category]) : category;
}
