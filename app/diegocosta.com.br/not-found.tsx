import PageDescription from '~/components/PageDescription';

import { getTranslations } from '~/lib/i18n/messages';

import config from '~/app/diegocosta.com.br/config';

export default function NotFoundPage() {
  const t = getTranslations(config);

  return (
    <div id="centered-page">
      <PageDescription content={t('page.notFound.message', { domain: config.domain })} />
    </div>
  );
}
