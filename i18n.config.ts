import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { es, en, ca } from "./translations/translations";
const { languageDetectorPlugin } = require("./translations/languageDetectorPlugin");

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
  ca: {
    translation: ca,
  }
};

i18n.use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    //language to use if translations in user language are not available
    fallbackLng: "es",
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    react: {
      useSuspense: false, //in case you have any suspense related errors
    }
  });

export default i18n;