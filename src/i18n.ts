import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationMR from './locales/mr/translation.json';
import translationHI from './locales/hi/translation.json';
import translationKN from './locales/kn/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    mr: {
        translation: translationMR
    },
    hi: {
        translation: translationHI
    },
    kn: {
        translation: translationKN
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
