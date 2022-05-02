import React from 'react';
import { useTranslation } from 'react-i18next';

import Logo from '@/icons/Logo';

import * as styles from './index.module.scss';

const Topbar = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.topbar}>
      <Logo className={styles.logo} />
      <div className={styles.line} />
      <div className={styles.text}>{t('admin_console.title')}</div>
    </div>
  );
};

export default Topbar;
