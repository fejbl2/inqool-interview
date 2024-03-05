import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import locales from "./locales";

// just an alias
export const resources = locales;

export const availableLanguages = Object.keys(
  locales
) as (keyof typeof locales)[];
export type AvailableLanguage = (typeof availableLanguages)[number];

export const languageToFlagUrl: Record<AvailableLanguage, string> = {
  cs: "https://flagcdn.com/w20/cz.png",
  en: "https://flagcdn.com/w20/us.png",
};

export const initI18N = () => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      // the translations
      // (tip move them in a JSON file and import them,
      // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
      resources,
      lng: "en", // if you're using a language detector, do not define the lng option
      fallbackLng: "en",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
};
