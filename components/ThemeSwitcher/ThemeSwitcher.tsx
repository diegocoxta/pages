'use client';

import { FiSun, FiMoon } from 'react-icons/fi';

import { useTranslator } from '~/components/TranslationProvider';

import styles from './styles.module.css';

interface ThemeSwitcherProps {
  onClick?: () => unknown;
  isDarkMode: boolean;
}

export default function ThemeSwitcher({ isDarkMode, onClick }: ThemeSwitcherProps): React.ReactElement {
  const t = useTranslator();

  return (
    <button
      className={styles.container}
      data-isdarkmode={`${isDarkMode}`}
      aria-checked={isDarkMode}
      aria-label={t('components.themeSwitcher.ariaLabel')}
      onClick={onClick}
      data-testid="themeswitcher--button"
      role="switch"
    >
      <span className={styles.indicator} aria-hidden>
        {isDarkMode ? (
          <FiMoon data-testid="react-icon-bsmoon" size={16} />
        ) : (
          <FiSun data-testid="react-icon-bssun" size={16} />
        )}
      </span>
    </button>
  );
}
