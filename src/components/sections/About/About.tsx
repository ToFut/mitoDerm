'use client';
import { FC } from 'react';
import styles from './About.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '../../sharedUI/Button/Button';
import { usePathname } from 'next/navigation';

const scrollTo = () => {
  const element = document.getElementById('faq');
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return;
};

const About: FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const isEventPage = pathname ? pathname.includes('event') : false;

  return (
    <section id='about' className={styles.section}>
      <article className={styles.article}>
        <div className={styles.textContainer}>
          <h2>
            {t('about.titleP1')}
            <span>{t('about.titleP2')}</span>
          </h2>
          <p>
            {t('about.text1')}
            <span>{t('about.text1Colored')}</span>
            <br />
            <br />
            {t('about.text2')}
            <span>{t('about.text2Colored')}</span>
          </p>
        </div>
        <div className={styles.imageContainer}>
          <Image src='/images/whatIsExosome.svg' fill alt='exosome examples' />
        </div>
      </article>
      <Button
        style={{ marginBlock: 40, marginBottom: isEventPage ? 80 : 40 }}
        text={t(isEventPage ? 'buttons.seat' : 'buttons.moreAbout')}
        onClick={!isEventPage ? scrollTo : () => null}
        formPage={isEventPage ? 'event' : 'main'}
      />
    </section>
  );
};

export default About;
