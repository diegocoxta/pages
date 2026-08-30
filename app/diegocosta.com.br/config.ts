import npmPackage from '~/package.json';
import type { ConfigType } from '~/lib/config';

type LocalConfigType = ConfigType & {
  bio: string;
  repository: string;
};

const profile: LocalConfigType = {
  title: 'Diego Costa',
  jobTitle: ['Engineering Manager', 'Senior Software Engineer'],
  description: 'config.description',
  domain: 'diegocosta.com.br',
  locales: ['pt'],
  author: 'Diego Costa',
  avatar: 'https://avatars.githubusercontent.com/u/3134422?v=4',
  bio: 'site.bio',
  links: [
    { type: 'text', title: 'config.links.blog.title', href: '/blog' },
    { type: 'text', title: 'config.links.cv.title', href: '/cv' },
    { type: 'text', title: 'E-mail', href: 'mailto:diego@diegocosta.com.br' },
    { type: 'text', title: 'LinkedIn', href: 'https://linkedin.com/in/diegocoxta' },
    { type: 'text', title: 'Mastodon', href: 'https://mastodon.social/@diegocoxta' },
    { type: 'text', title: 'config.links.more.title', href: 'https://diegocoxta.com' },
  ],
  repository: npmPackage.repository.url,
};

export default profile;
