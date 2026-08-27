import type { dictionaryGerman } from './dictionary_german'

// All English texts of the app. The type makes sure this file has exactly the
// same keys as dictionary_german.ts.
export const dictionaryEnglish: typeof dictionaryGerman = {
  general: {
    guest: 'Guest',
    signIn: 'Sign in',
    signInWithGoogle: 'Sign in with Google',
    signOut: 'Sign out',
    upgrade: 'Upgrade',
  },
  sidebar: {
    home: 'Home',
    images: 'Images',
    newProject: 'New project',
  },
  settings: {
    title: 'Settings',
    accountGroup: 'Account',
    language: 'Language',
    languageGerman: 'Deutsch',
    languageEnglish: 'English',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    accessibility: 'Accessibility',
    subscriptionGroup: 'Subscription',
    perMonth: 'per month',
    storage: 'Storage',
    storageUsed: 'used',
    freeProjects: 'Free projects',
    dataLocation: 'Location of your data',
    dataLocationSoonTitle: 'Coming soon',
    dataLocationSoonText: 'Here you will be able to choose where your data is stored.',
  },
}
