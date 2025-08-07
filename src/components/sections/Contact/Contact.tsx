import { FC } from 'react';
import styles from './Contact.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import ContactLink from './ContactLink/ContactLink';

const Contact: FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <section id='contact' className={styles.section}>
      <div className={styles.glassBg} />
      <div className={styles.content}>
        <h2 className={styles.gradientTitle}>Contact Us</h2>
        <div className={styles.contacts}>
          <div className={styles.contactsItem}>
            <span className={styles.contactsItemTitle}>
              {t('contactUs.item1title')}
            </span>
            <div className={styles.contactInfo}>
              <div className={styles.contactRow}>
                <span className={styles.contactLabel}>{t('contactUs.phone')}</span>
                <span className={styles.contactValue}>
                  {t('contactUs.phoneText')}
                  <a
                    className={styles.contactLink}
                    dir='ltr'
                    href=' https://wa.me/972547621889'
                    target='_blank'
                  >
                    {' 0547621889 '}
                  </a>
                </span>
              </div>
              <div className={styles.contactRow}>
                <span className={styles.contactLabel}>{t('contactUs.address')}</span>
                <span className={styles.contactValue}>{t('contactUs.addressText')}</span>
              </div>
              <div className={styles.contactRow}>
                <span className={styles.contactLabel}>{t('contactUs.email')}</span>
                <a href='mailto:info@mitoderm.com' className={styles.contactLink}>
                  {t('contactUs.emailText')}
                </a>
              </div>
            </div>
          </div>
          <div className={styles.contactsItem}>
            <span className={styles.contactsItemTitle}>
              {t('contactUs.item2title')}
            </span>
            <div className={styles.item2textBox}>
              <div className={styles.column}>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleLabel}>{t('contactUs.workWeek')}</span>
                  <span className={styles.scheduleTime}>9:00 - 21:00</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleLabel}>{t('contactUs.friday')}</span>
                  <span className={styles.scheduleTime}>{t('contactUs.fridayText')}</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleLabel}>{t('contactUs.saturday')}</span>
                  <span className={styles.scheduleTime}>{t('contactUs.closed')}</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleLabel}>{t('contactUs.followUs')}</span>
                  <div className={`${styles.linkBox} ${locale === 'he' && styles.he}`}>
                    <ContactLink
                      imageLink='/images/contacts/instagram.svg'
                      url={process.env.NEXT_PUBLIC_LINK_INSTAGRAM as string}
                    />
                    <ContactLink
                      imageLink='/images/contacts/tiktok.svg'
                      url={process.env.NEXT_PUBLIC_LINK_TIKTOK as string}
                    />
                    <ContactLink
                      imageLink='/images/contacts/google.svg'
                      url={process.env.NEXT_PUBLIC_LINK_GOOGLE as string}
                    />
                    <ContactLink
                      imageLink='/images/contacts/facebook.svg'
                      url={process.env.NEXT_PUBLIC_LINK_FACEBOOK as string}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
