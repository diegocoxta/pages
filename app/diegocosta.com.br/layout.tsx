import type { Metadata } from 'next';

import { contentFor } from '~/lib/md';
import { getClientMessages, getTranslations } from '~/lib/translations';

import TranslationProvider from '~/components/TranslationProvider';
import PersonSchema from '~/components/PersonSchema';
import Header from '~/components/Header';
import Branding from '~/components/Branding';
import ThemeSwitcher from '~/components/ThemeSwitcher';
import CommandBar from '~/components/CommandBar';
import Footer from '~/components/Footer';

import config from '~/app/diegocosta.com.br/config';

const content = contentFor(config);

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const t = await getTranslations(config);
  const messages = await getClientMessages(config);

  const pages = content.getPages();
  const posts = content.getPosts();

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
  const t = await getTranslations(config);

  return {
    metadataBase: new URL(`https://${config.domain}`),
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
