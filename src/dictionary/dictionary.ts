import { reactive, ref } from 'vue'
import { dictionaryGerman } from './dictionary_german'
import { dictionaryEnglish } from './dictionary_english'
import { dictionarySpanish } from './dictionary_spanish'
import { dictionaryFrench } from './dictionary_french'
import { dictionaryPortuguese } from './dictionary_portuguese'

// Every language the app can show. One more line here is one more language.
const dictionaries = {
  de: dictionaryGerman,
  en: dictionaryEnglish,
  es: dictionarySpanish,
  fr: dictionaryFrench,
  pt: dictionaryPortuguese,
}

export type LanguageCode = keyof typeof dictionaries

export const currentLanguage = ref<LanguageCode>('de')

// The texts of the language currently in use. Import it anywhere and read a
// text as dictionary.settings.title — templates update themselves as soon as
// setLanguage() is called.
export const dictionary = reactive({ ...dictionaryGerman })

export function setLanguage(language: LanguageCode) {
  currentLanguage.value = language
  Object.assign(dictionary, dictionaries[language])

  // Tell the browser which language it is looking at, otherwise it offers to
  // translate the page into the language it already is.
  document.documentElement.lang = language
}
