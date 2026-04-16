import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'fr', 'de', 'es', 'ja', 'ru', 'cn', 'tw', 'nl', 'it', 'ko'],
});

export const localeDisplayNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ja: '日本語',
  ru: 'Русский',
  cn: '简体中文',
  tw: '繁體中文',
  nl: 'Nederlands',
  it: 'Italiano',
  ko: '한국어',
};
