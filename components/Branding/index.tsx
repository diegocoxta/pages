import Link from 'next/link';

import styles from './styles.module.css';

interface BrandingProps {
  name: string;
}

export default function Branding(props: BrandingProps) {
  const { name } = props;
  const [firstName, lastName] = name.split(' ');

  return (
    <h1 className={styles.name}>
      <Link className={styles.link} href="/" data-testid="logo-link">
        {firstName}
        {lastName && (
          <span className={styles.lastName} data-testid="logo-lastname">
            {lastName[0]}
            <span className={styles.lastNameHidden}>{lastName.slice(1)}</span>.
          </span>
        )}
      </Link>
    </h1>
  );
}
