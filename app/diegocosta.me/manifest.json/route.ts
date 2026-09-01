import { NextResponse } from 'next/server';

import * as envs from '~/lib/envs';
import { getTranslations } from '~/lib/translations';

import config from '~/app/diegocosta.me/config';

export const revalidate = 76800;

export const GET = async () => {
  const t = await getTranslations(config);

  return NextResponse.json(
    {
      name: t(config.title),
      short_name: t(config.title),
      description: t(config.description),
      start_url: '/',
      display: 'standalone',
      theme_color: envs.SITE_ACCENT_COLOR,
      icons: [
        {
          src: '/icon',
          sizes: 'any',
          type: 'image/png',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
};
