import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";

import { enLocale } from "./locales/en";
import { ruLocale } from "./locales/ru";

export interface IInitLocalizationParams {
  initLang?: string;
  isServer?: boolean;
}

export const initLocalization = ({
  initLang = "en",
}: IInitLocalizationParams) =>
  i18next.use(initReactI18next).init({
    fallbackLng: initLang,
    lng: getLocales()[0].languageCode,
    debug: false,
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
      prefix: "",
    },
    resources: {
      en: { translation: { ...enLocale } },
      ru: { translation: { ...ruLocale } },
    },
  });
