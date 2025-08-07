'use client';
import { FC, useState, useRef, useEffect } from 'react';
import styles from './LanguageSwitch.module.scss';
import Image from 'next/image';
import SwitchItem from './SwitchItem/SwitchItem';
import { useMediaQuery } from 'react-responsive';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const LanguageSwitch: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const popupRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const isEventFormPage = pathname ? pathname.includes('event/form') : false;
  const isEventPage = pathname ? pathname.includes('event') : false;
  const isFormPage = pathname ? pathname.includes('form') : false;

  const handleClick = () => {
    setIsOpen(() => !isOpen);
  };
  const closeOpenMenu = (e: MouseEvent) => {
    if (
      isOpen &&
      popupRef.current &&
      !popupRef.current?.contains(e.target as Node)
    )
      setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) window.addEventListener('click', closeOpenMenu);
    return () => window.removeEventListener('click', closeOpenMenu);
  }, [isOpen]);

  const currentUrl = isEventFormPage
    ? '/event/form'
    : isFormPage
    ? '/form'
    : isEventPage
    ? '/event'
    : '/';

  return (
    <div
      aria-label='language switch'
      role='button'
      ref={popupRef}
      className={`${styles.container} ${
        isTabletOrMobile && styles.containerMobile
      }`}
      onClick={handleClick}
    >
      <div className={styles.currenSelection}>
        <Image
          className={styles.button}
          width={isTabletOrMobile ? 16 : 20}
          height={isTabletOrMobile ? 16 : 20}
          alt={`${locale} flag`}
          src={`/images/languageSwitch/${locale}.svg`}
        />
        <span
          className={`${styles.localeText} ${
            isTabletOrMobile && styles.mobile
          }`}
        >
          {locale}
        </span>
        <Image
          className={`${styles.switchIcon} + ${isOpen ? styles.active : ''}`}
          src={'/images/arrowDownBlack.svg'}
          width={10}
          height={5.5}
          alt='arrow icon'
        />
        {isOpen ? (
          <div className={styles.popup}>
            {locale === 'en' ? (
              <>
                <SwitchItem
                  url={currentUrl}
                  imageSrc='/images/languageSwitch/ru.svg'
                  text='RU'
                  locale='ru'
                />
                <SwitchItem
                  url={currentUrl}
                  imageSrc='/images/languageSwitch/he.svg'
                  text='HE'
                  locale='he'
                />
              </>
            ) : locale === 'ru' ? (
              <>
                <SwitchItem
                  url={currentUrl}
                  imageSrc='/images/languageSwitch/en.svg'
                  text='EN'
                  locale='en'
                />
                <SwitchItem
                  url={currentUrl}
                  imageSrc='/images/languageSwitch/he.svg'
                  text='HE'
                  locale='he'
                />
              </>
            ) : (
              <>
                <SwitchItem
                  url={currentUrl}
                  imageSrc='/images/languageSwitch/en.svg'
                  text='EN'
                  locale='en'
                />
                <SwitchItem
                  url={currentUrl}
                  imageSrc='/images/languageSwitch/ru.svg'
                  text='RU'
                  locale='ru'
                />
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LanguageSwitch;
