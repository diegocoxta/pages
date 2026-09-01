export const LOCALES = ['pt', 'en', 'es'] as const;

export const LOCALE_COOKIE = 'LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Locale = (typeof LOCALES)[number];

export type Translator = {
  (key: string, params?: Record<string, string | number>): string;
  date: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  locale: Locale;
};

export type ComponentWithTranslator<P = unknown> = P & { t: Translator };

/**
 * Prefixos que identificam uma chave de tradução. Qualquer string fora deles
 * (ex.: "LinkedIn", "Unsplash", "diegocosta.com.br") é texto literal: nomes
 * próprios e marcas não passam pelo dicionário.
 */
const MESSAGE_KEY = /^(config|components|page)\./;

export function isMessageKey(value: string): boolean {
  return MESSAGE_KEY.test(value);
}

/** Prefixos de chaves consumidas por Client Components — só elas vão para o browser. */
export const CLIENT_MESSAGE_PREFIXES = ['components.commandBar.', 'components.themeSwitcher.'] as const;

export function pickClientMessages(messages: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(messages).filter(([key]) => CLIENT_MESSAGE_PREFIXES.some((prefix) => key.startsWith(prefix)))
  );
}

function interpolate(value: string, params: Record<string, string | number>): string {
  return value.replace(/\{(\w+)\}/g, (_, name: string) => (name in params ? String(params[name]) : `{${name}}`));
}

export function createTranslator(messages: Record<string, string>, locale: Locale): Translator {
  const plural = new Intl.PluralRules(locale);

  const lookup = (key: string, params?: Record<string, string | number>): string | undefined => {
    const direct = messages[key];

    if (typeof direct === 'string') {
      return direct;
    }

    // Sem correspondência exata: com `count` numérico, tenta as variantes de
    // plural (`<key>_one`, `<key>_other`, …) resolvidas pelas regras do locale.
    if (params && params.count !== undefined) {
      const count = Number(params.count);

      if (!Number.isNaN(count)) {
        const variant = messages[`${key}_${plural.select(count)}`];
        return typeof variant === 'string' ? variant : messages[`${key}_other`];
      }
    }

    return undefined;
  };

  const t = ((key: string, params?: Record<string, string | number>): string => {
    const value = lookup(key, params);

    if (value === undefined) {
      if (process.env.NODE_ENV !== 'production' && isMessageKey(key)) {
        console.warn(`[i18n] chave ausente: "${key}" (${locale})`);
      }

      return key;
    }

    return params ? interpolate(value, params) : value;
  }) as Translator;

  t.locale = locale;
  t.date = (value, options): string => new Date(value).toLocaleDateString(locale, { timeZone: 'UTC', ...options });

  return t;
}

export function isSupportedLocale(supported: readonly Locale[], value?: string | null): value is Locale {
  return !!value && (supported as readonly string[]).includes(value);
}

export function negotiateLocale(
  supported: readonly Locale[],
  cookie?: string | null,
  acceptLanguage?: string | null
): Locale {
  const pool = supported as readonly string[];

  if (cookie && pool.includes(cookie)) {
    return cookie as Locale;
  }

  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((part) => {
      const [tag, ...modifiers] = part.trim().split(';');
      const weight = modifiers.map((modifier) => modifier.trim()).find((modifier) => modifier.startsWith('q='));
      const q = weight ? Number(weight.slice(2)) : 1;

      // `q` malformado (ex.: "q=abc") não descarta o idioma: cai no peso padrão.
      return { tag: tag.trim().slice(0, 2).toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (pool.includes(tag)) {
      return tag as Locale;
    }
  }

  return supported[0];
}
