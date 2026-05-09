import i18next from "i18next";
import fs from "fs";

const en = JSON.parse(fs.readFileSync('./locales/en/translation.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('./locales/hi/translation.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('./locales/mr/translation.json', 'utf8'));
const kn = JSON.parse(fs.readFileSync('./locales/kn/translation.json', 'utf8'));

i18next.init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    kn: { translation: kn },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
}, async (err, t) => {
  if (err) return console.log('something went wrong loading', err);

  const keys = ["cad", "heart_failure", "congenital", "arrhythmias", "cardiomyopathy", "pad", "hypertension", "diabetes", "tavi"];
  
  for (const lang of ['en', 'hi', 'mr', 'kn']) {
    await i18next.changeLanguage(lang);
    console.log(`\n\n=== Language: ${lang} ===`);
    for (let key of keys) {
      try {
        const title = t(`treatments.${key}`);
        const desc = t(`treatments.${key}_desc`);
        const overview = t(`treatments.${key}_details.overview`, { defaultValue: "" });
        const symptoms = t(`treatments.${key}_details.symptoms`, { returnObjects: true, defaultValue: [] });
        const causes = t(`treatments.${key}_details.causes`, { returnObjects: true, defaultValue: [] });
        const treatmentsDetails = t(`treatments.${key}_details.treatments`, { returnObjects: true, defaultValue: [] });
        
        if (typeof title !== 'string') throw new Error(`${key} title is not string: ${title}`);
        if (typeof desc !== 'string') throw new Error(`${key} desc is not string: ${desc}`);
        if (!Array.isArray(symptoms)) throw new Error(`${key} symptoms is not array: ${symptoms}`);
        if (!Array.isArray(causes)) throw new Error(`${key} causes is not array: ${causes}`);
        if (!Array.isArray(treatmentsDetails)) throw new Error(`${key} treatments array is not array: ${treatmentsDetails}`);
        
      } catch (e) {
        console.error(`ERROR in ${lang} for ${key}:`, e.message);
      }
    }
    console.log(`Passed ${lang}`);
  }
});
