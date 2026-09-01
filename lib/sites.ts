import { NextResponse, type NextRequest } from 'next/server';

import type { ConfigType } from '~/lib/config';
import { LOCALES, type Locale } from '~/lib/i18n';

import diegocoxtaCom from '~/app/diegocoxta.com/config';
import diegocostaComBr from '~/app/diegocosta.com.br/config';
import diegocostaMe from '~/app/diegocosta.me/config';

export type Site = Pick<ConfigType, 'domain' | 'locales'>;

const SITES: readonly Site[] = [diegocoxtaCom, diegocostaComBr, diegocostaMe];

export function getSiteLocales(hostname: string): readonly Locale[] {
  return SITES.find((site) => site.domain === hostname)?.locales ?? [LOCALES[0]];
}

export function hasLocaleRouting(locales: readonly Locale[]): boolean {
  return locales.length > 1;
}

export function resolveHostname(request: NextRequest): string {
  const hostname = (request.headers.get('host') || '').split(':')[0];

  if (hostname === 'localhost') {
    return process.env.DEV_SITE || 'diegocosta.com.br';
  }

  return hostname;
}

export function rewriteWithLocale(request: NextRequest, hostname: string, pathname: string, locale: string) {
  const url = request.nextUrl.clone();

  url.pathname = `/${hostname}${pathname}`;

  return NextResponse.rewrite(url);
}
