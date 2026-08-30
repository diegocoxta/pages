import { NextRequest } from 'next/server';

import type { ConfigType } from '~/lib/config';

import diegocoxtaCom from '~/app/diegocoxta.com/config';
import diegocostaComBr from '~/app/diegocosta.com.br/config';
import diegocostaMe from '~/app/diegocosta.me/config';

export type Site = Pick<ConfigType, 'domain' | 'locales'>;

const SITES: readonly Site[] = [diegocoxtaCom, diegocostaComBr, diegocostaMe];

export function getSiteLocales(hostname: string): readonly string[] {
  return SITES.find((site) => site.domain === hostname)?.locales ?? ['pt'];
}

export function hasLocaleRouting(locales: readonly string[]): boolean {
  return locales.length > 1;
}

export function resolveHostname(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0];

  if (hostname === 'localhost') {
    return process.env.DEV_SITE || 'diegocosta.com.br';
  }

  return hostname;
}

export function rewriteToSite(request: NextRequest, hostname: string, pathname: string) {
  const url = request.nextUrl.clone();

  url.pathname = `/${hostname}${pathname}`;

  return url;
}
