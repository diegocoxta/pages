import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { cache } from 'react';

import { createTranslator, isSupportedLocale, pickClientMessages, type Locale, type Translator } from '~/lib/i18n';
import type { SiteType } from '~/lib/config';

function resolveLocale(site: SiteType, locale?: string | null): Locale {
  return isSupportedLocale(site.locales, locale) ? locale : site.locales[0];
}

const readDictionary = cache((domain: string, locale: Locale): Record<string, string> => {
  const file = path.join(process.cwd(), 'public', domain, 'translations', `${locale}.json`);

  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as Record<string, string>;
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] dicionário ausente: ${domain}/translations/${locale}.json`);
    }

    return {};
  }
});

const loadMessages = cache((site: SiteType, locale: Locale): Record<string, string> => {
  const fallback = site.locales[0];

  if (locale === fallback) {
    return readDictionary(site.domain, locale);
  }

  return { ...readDictionary(site.domain, fallback), ...readDictionary(site.domain, locale) };
});

export const getTranslations = cache(async (site: SiteType, locale?: string): Promise<Translator> => {
  const resolved = resolveLocale(site, locale);
  return createTranslator(loadMessages(site, resolved), resolved);
});

export const getClientMessages = cache(async (site: SiteType, locale?: string): Promise<Record<string, string>> => {
  return pickClientMessages(loadMessages(site, resolveLocale(site, locale)));
});
