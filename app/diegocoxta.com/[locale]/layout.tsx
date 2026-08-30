import { notFound } from 'next/navigation';

import { isSupportedLocale } from '~/lib/i18n';

import config from '~/app/diegocoxta.com/config';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return config.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(config.locales, locale)) {
    notFound();
  }

  return children;
}
