import Container from '~/components/Container';
import CodeBlock from '~/components/CodeBlock';

import { getTranslations } from '~/lib/translations';

import config from '~/app/diegocosta.com.br/config';

export default async function NotFoundPage() {
  const t = await getTranslations(config, config.locales[0]);

  return (
    <Container>
      <CodeBlock className="language-plain">{t('page.notFound.message', { domain: config.domain })}</CodeBlock>
    </Container>
  );
}
