'use client';
import { FC } from 'react';
import styles from './Footer.module.scss';
import { useTranslations } from 'next-intl';
import useAppStore from '@/store/store';
import { usePathname } from '@/i18n/routing';

const Footer: FC = () => {
  const setModalContent = useAppStore((state) => state.setModalContent);
  const toggleModal = useAppStore((state) => state.toggleModal);
  const t = useTranslations();
  const pathname = usePathname();
  const isFormPage = pathname.includes('form');

  const handlePrivacyClick = () => {
    toggleModal(true);
    setModalContent('privatePolicy');
  };

  const handleAccessibilityClick = () => {
    toggleModal(true);
    setModalContent('accessibility');
  };

  return (
    <footer
      style={isFormPage ? { padding: '30px 0' } : {}}
      className={styles.footer}
    >
      <div className={styles.content}>
        <span className={styles.copyright}>{t('footer.copyright')}</span>
        <div className={styles.textContainer}>
          <span onClick={handleAccessibilityClick} className={styles.item}>
            {t('footer.accessibility')}
          </span>
          <span onClick={handlePrivacyClick} className={styles.item}>
            {t('footer.privacy')}
          </span>
          <span className={styles.item}>{t('footer.group')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
