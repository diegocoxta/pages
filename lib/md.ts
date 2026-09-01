import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { cache } from 'react';

import type { ConfigType } from '~/lib/config';

export type ContentAttributes = {
  title: string;
  slug: string;
  content: string;
  readingTime: number;
  summary?: string;
  status?: string;
};

export type BlogContentAttributes = ContentAttributes & {
  date?: string;
  language?: string;
  tags?: Array<string>;
  expanded?: string;
};

function resolveContentFile(
  site: string,
  filename: string,
  locale?: string,
  defaultLocale?: string
): string | undefined {
  const dir = path.join(process.cwd(), 'public', site, filename);

  const candidates = [
    locale && `index.${locale}.md`,
    defaultLocale && defaultLocale !== locale && `index.${defaultLocale}.md`,
    'index.md',
  ].filter((name): name is string => Boolean(name));

  for (const name of candidates) {
    const file = path.join(dir, name);

    if (fs.existsSync(file)) {
      return file;
    }
  }

  return undefined;
}

const readFile = cache(function readFile<T extends ContentAttributes>(
  site: string,
  filename: string,
  locale?: string,
  defaultLocale?: string
): T | undefined {
  const file = resolveContentFile(site, filename, locale, defaultLocale);

  if (!file) {
    return undefined;
  }

  const { data, content } = matter(fs.readFileSync(file, 'utf-8'));

  if (data.date) {
    data.date = new Date(data.date).toISOString().slice(0, 10);
  }

  data.readingTime = readingTime(content).minutes;

  return { ...data, content: updateContentImagePaths(content, site, filename) } as T;
});

function getFileList<T extends ContentAttributes>(
  site: string,
  dir: string,
  locale?: string,
  defaultLocale?: string
): Array<T> {
  const fileDir = path.join(process.cwd(), 'public', site, dir);

  if (!fs.existsSync(fileDir)) {
    return [];
  }

  return fs
    .readdirSync(fileDir)
    .map((slug) => {
      const file = readFile<T>(site, `${dir}/${slug}`, locale, defaultLocale);

      return file ? { ...file, slug } : undefined;
    })
    .filter((entry): entry is T => entry !== undefined);
}

function updateContentImagePaths(bodyContent: string, site: string, dirname: string) {
  return bodyContent.replace(/!\[(.*?)\]\(\.\/([^)]+)\)/g, (_, altText, fileName) => {
    return `![${altText}](${dirname}/${fileName})`;
  });
}

const getPages = cache(function getPages(site: string, locale?: string, defaultLocale?: string) {
  return getFileList(site, `/pages`, locale, defaultLocale).filter((page) => page.status !== 'draft');
});

const getPosts = cache(function getPosts(site: string, locale?: string, defaultLocale?: string) {
  return getFileList<BlogContentAttributes>(site, `/posts`, locale, defaultLocale)
    .filter((post) => post.status !== 'draft')
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
});

const getTags = cache(function getTags(site: string, locale?: string, defaultLocale?: string) {
  const tags = getFileList<BlogContentAttributes>(site, `/posts`, locale, defaultLocale)
    .filter((post) => post.status !== 'draft')
    .flatMap((post) => post.tags ?? []);

  return [...new Set(tags)];
});

export function contentFor({ domain, locales }: Pick<ConfigType, 'domain' | 'locales'>) {
  const [defaultLocale] = locales;

  return {
    readFile: <T extends ContentAttributes>(filename: string, locale?: string): T | undefined =>
      readFile<T>(domain, filename, locale, defaultLocale),
    getPages: (locale?: string) => getPages(domain, locale, defaultLocale),
    getPosts: (locale?: string) => getPosts(domain, locale, defaultLocale),
    getTags: (locale?: string) => getTags(domain, locale, defaultLocale),
  };
}
