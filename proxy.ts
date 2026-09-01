import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isSupportedLocale, negotiateLocale } from '~/lib/i18n';
import { getSiteLocales, hasLocaleRouting, resolveHostname, rewriteWithLocale } from '~/lib/sites';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

const NON_LOCALIZED =
  /^\/(icon|apple-icon|opengraph-image|twitter-image|robots\.txt|manifest\.json|sitemap\.xml)(\/|$)|\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hostname = resolveHostname(request);
  const locales = getSiteLocales(hostname);

  const onlyOneLanguageOrAssetMetadata = !hasLocaleRouting(locales) || NON_LOCALIZED.test(pathname);

  if (onlyOneLanguageOrAssetMetadata) {
    return rewriteWithLocale(request, hostname, pathname, locales[0]);
  }

  const firstSegment = pathname.split('/')[1];
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;

  const withoutLanguagePrefix = !isSupportedLocale(locales, firstSegment);

  if (withoutLanguagePrefix) {
    const locale = negotiateLocale(locales, cookie, request.headers.get('accept-language'));
    const url = request.nextUrl.clone();

    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

    return NextResponse.redirect(url);
  }

  const response = rewriteWithLocale(request, hostname, pathname, firstSegment);

  if (cookie !== firstSegment) {
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}
