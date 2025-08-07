import { FC } from 'react';
import styles from './CenterList.module.scss';
import Dropdown from '../../sharedUI/Dropdown/Dropdown';
import { centerItemData } from '@/constants';
import { useTranslations } from 'next-intl';

const CenterList: FC = () => {
  const t = useTranslations();
  return (
    <section id='clinic' className={styles.container}>
      <div className={styles.glassBg} />
      <h2 className={styles.gradientTitle}>{t('faq.centerTitle')}</h2>
      <div className={styles.containerInner}>
        <Dropdown data={centerItemData} />
      </div>
    </section>
  );
};

export default CenterList;
