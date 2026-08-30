import 'server-only';
import { cache } from 'react';

import type { Site } from '~/lib/sites';
import { createTranslator, isSupportedLocale, type Locale, type Translator } from '~/lib/i18n';

function resolveLocale(site: Site, locale: string): Locale {
  return isSupportedLocale(site.locales, locale) ? locale : site.locales[0];
}

const loadMessages = cache(async (domain: string, locale: Locale): Promise<Record<string, string>> => {
  const dictionary = await import(`~/public/${domain}/translations/${locale}.json`);
  return dictionary.default;
});

export const getTranslations = cache(async (site: Site, locale: string): Promise<Translator> => {
  const resolved = resolveLocale(site, locale);
  return createTranslator(await loadMessages(site.domain, resolved), resolved);
});

/** Dicionário cru do site — para alimentar o `TranslationProvider` dos Client Components. */
export const getMessages = cache(async (site: Site, locale: string): Promise<Record<string, string>> => {
  return loadMessages(site.domain, resolveLocale(site, locale));
});
