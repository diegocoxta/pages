import { redirect } from 'next/navigation';

import config from '~/app/diegocoxta.com/config';

export const revalidate = 3600;

export default function HomePage() {
  redirect(`/${config.locales[0]}`);
}
