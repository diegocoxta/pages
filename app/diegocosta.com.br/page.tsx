import AboutMe from '~/components/AboutMe';

import { getTranslations } from '~/lib/translations';

import config from '~/app/diegocosta.com.br/config';

export default async function HomePage() {
  const t = await getTranslations(config);

  return (
    <div id="centered-page">
      <AboutMe t={t} />
    </div>
  );
}
