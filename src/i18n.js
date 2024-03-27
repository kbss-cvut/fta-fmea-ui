import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import translationEN from "../public/locales/en/translation.json";
import translationCS from "../public/locales/cs/translation.json";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      cs: { translation: translationCS },
    },
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
