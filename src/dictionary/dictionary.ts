import { reactive, ref } from 'vue'
import { dictionaryGerman } from './dictionary_german'
import { dictionaryEnglish } from './dictionary_english'

export type LanguageCode = 'de' | 'en'

export const currentLanguage = ref<LanguageCode>('de')

// The texts of the language currently in use. Import it anywhere and read a
// text as dictionary.settings.title — templates update themselves as soon as
// setLanguage() is called.
export const dictionary = reactive({ ...dictionaryGerman })

export function setLanguage(language: LanguageCode) {
  currentLanguage.value = language
  Object.assign(dictionary, language === 'en' ? dictionaryEnglish : dictionaryGerman)

  // Tell the browser which language it is looking at, otherwise it offers to
  // translate the page into the language it already is.
  document.documentElement.lang = language
}
