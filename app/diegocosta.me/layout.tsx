import type { Metadata } from 'next';

import { getMessages, getTranslations } from '~/lib/translations';

import { TranslationProvider } from '~/components/TranslationProvider';
import PersonSchema from '~/components/PersonSchema';
import Header from '~/components/Header';
import Branding from '~/components/Branding';
import ThemeSwitcher from '~/components/ThemeSwitcher';
import Footer from '~/components/Footer';

import config from '~/app/diegocosta.me/config';

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const t = await getTranslations(config, config.locales[0]);
  const messages = await getMessages(config, config.locales[0]);

  return (
    <TranslationProvider messages={messages} locale={t.locale}>
      <PersonSchema data={config} />
      <Header left={<Branding name={config.author} />} right={<ThemeSwitcher />} />
      {children}
      <Footer author={config.author} t={t} />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(config, config.locales[0]);

  return {
    metadataBase: `https://${config.domain}`,
    title: {
      template: `%s | ${t(config.title)}`,
      default: t(config.title),
    },
    description: t(config.description),
    alternates: {
      canonical: '/',
    },
  };
}
