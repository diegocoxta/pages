import type { Metadata } from 'next';

import { getPages, getPosts } from '~/lib/md';
import { getMessages, getTranslations } from '~/lib/translations';

import { TranslationProvider } from '~/components/TranslationProvider';
import PersonSchema from '~/components/PersonSchema';
import Header from '~/components/Header';
import Branding from '~/components/Branding';
import ThemeSwitcher from '~/components/ThemeSwitcher';
import CommandBar from '~/components/CommandBar';
import Footer from '~/components/Footer';

import config from '~/app/diegocosta.com.br/config';

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const t = await getTranslations(config, config.locales[0]);
  const messages = await getMessages(config, config.locales[0]);

  const pages = getPages(config.domain);
  const posts = getPosts(config.domain);

  return (
    <TranslationProvider messages={messages} locale={t.locale}>
      <PersonSchema data={config} />
      <Header
        left={<Branding name={config.author} />}
        right={
          <>
            <ThemeSwitcher />
            <CommandBar pages={pages} posts={posts} repository={config.repository} />
          </>
        }
      />
      {children}
      <Footer author={config.author} links={config.links} t={t} />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(config, config.locales[0]);

  return {
    metadataBase: `https://${config.domain}`,
    title: {
      template: `%s | ${config.title}`,
      default: config.title,
    },
    description: t(config.description),
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': `https://${config.domain}/blog/feed`,
      },
    },
  };
}
