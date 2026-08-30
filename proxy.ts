import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { LOCALE_COOKIE, negotiateLocale } from '~/lib/i18n';
import { getSiteLocales, hasLocaleRouting, resolveHostname, rewriteToSite } from '~/lib/sites';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

const NON_LOCALIZED =
  /^\/(icon|apple-icon|opengraph-image|twitter-image|robots\.txt|manifest\.json|sitemap\.xml)(\/|$)|\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = resolveHostname(request);
  const locales = getSiteLocales(hostname);

  // Site de idioma único (ou asset/metadata): sem prefixo, serve direto no host.
  if (!hasLocaleRouting(locales) || NON_LOCALIZED.test(pathname)) {
    return NextResponse.rewrite(rewriteToSite(request, hostname, pathname));
  }

  const firstSegment = pathname.split('/')[1];

  // Sem prefixo de idioma suportado -> redireciona para o idioma negociado.
  if (!locales.includes(firstSegment)) {
    const locale = negotiateLocale(
      locales,
      request.cookies.get(LOCALE_COOKIE)?.value,
      request.headers.get('accept-language')
    );
    const url = request.nextUrl.clone();

    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

    return NextResponse.redirect(url);
  }

  // "/pt/..." -> interno "/<host>/pt/...", e persiste a escolha no cookie.
  const response = NextResponse.rewrite(rewriteToSite(request, hostname, pathname));

  response.cookies.set(LOCALE_COOKIE, firstSegment, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return response;
}
