const i18n = require('i18next');

const en = require('./locales/en/translation.json');
const hi = require('./locales/hi/translation.json');
const mr = require('./locales/mr/translation.json');
const kn = require('./locales/kn/translation.json');

i18n.init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    kn: { translation: kn },
  },
  lng: 'hi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
}, (err, t) => {
  if (err) return console.log('something went wrong loading', err);

  try {
    const keys = ["cad", "heart_failure", "congenital", "arrhythmias", "cardiomyopathy", "pad", "hypertension", "diabetes", "tavi"];
    
    for (let key of keys) {
      console.log("Testing key:", key);
      const overview = t(`treatments.${key}_details.overview`, { defaultValue: "" });
      const symptoms = t(`treatments.${key}_details.symptoms`, { returnObjects: true, defaultValue: [] });
      const causes = t(`treatments.${key}_details.causes`, { returnObjects: true, defaultValue: [] });
      const treatmentsDetails = t(`treatments.${key}_details.treatments`, { returnObjects: true, defaultValue: [] });
      
      console.log(`- ${key} overview type:`, typeof overview);
      console.log(`- ${key} symptoms type:`, Array.isArray(symptoms) ? 'array' : typeof symptoms, symptoms);
      
      if (!Array.isArray(symptoms)) {
        console.error(`ERROR: Symptoms for ${key} is not an array! It is ${typeof symptoms}`);
      }
      if (!Array.isArray(causes)) {
        console.error(`ERROR: Causes for ${key} is not an array! It is ${typeof causes}`);
      }
      if (!Array.isArray(treatmentsDetails)) {
        console.error(`ERROR: Treatments for ${key} is not an array! It is ${typeof treatmentsDetails}`);
      }
    }
  } catch (e) {
    console.error("Caught error:", e);
  }
});
