export const LOCALES = ['pt', 'en', 'es'] as const;

export const LOCALE_COOKIE = 'LOCALE';

export type Locale = (typeof LOCALES)[number];

export type Translator = {
  (key: string, params?: Record<string, string | number>): string;
  date: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  locale: Locale;
};

export type ComponentWithTranslator<P = unknown> = P & { t: Translator };

export function createTranslator(messages: Record<string, string>, locale: Locale): Translator {
  const t = ((key: string, params?: Record<string, string | number>): string => {
    const value = messages[key];

    if (typeof value !== 'string') {
      if (process.env.NODE_ENV !== 'production' && key.includes('.')) {
        console.warn(`[i18n] chave ausente: "${key}" (${locale})`);
      }

      return key;
    }

    if (!params) {
      return value;
    }

    return value.replace(/\{(\w+)\}/g, (_, name: string) => (name in params ? String(params[name]) : `{${name}}`));
  }) as Translator;

  t.locale = locale;
  t.date = (value, options): string => new Date(value).toLocaleDateString(locale, { timeZone: 'UTC', ...options });

  return t;
}

export function isSupportedLocale(supported: readonly Locale[], value?: string | null): value is Locale {
  return !!value && (supported as readonly string[]).includes(value);
}

export function negotiateLocale(supported: readonly string[], cookie?: string, acceptLanguage?: string | null): string {
  if (cookie && supported.includes(cookie)) {
    return cookie;
  }

  for (const part of acceptLanguage?.split(',') ?? []) {
    const tag = part.split(';')[0].trim().slice(0, 2);
    if (supported.includes(tag)) {
      return tag;
    }
  }

  return supported[0];
}
