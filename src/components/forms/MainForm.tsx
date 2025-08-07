'use client';
import { FC, FormEvent, useState, useEffect, useRef } from 'react';
import styles from './Form.module.scss';
import Image from 'next/image';
import Button from '../sharedUI/Button/Button';
import { useLocale, useTranslations } from 'next-intl';
import FormInput from './FormInput/FormInput';
import FormCloseButton from './FormCloseButton/FormCloseButton';
import { useMediaQuery } from 'react-responsive';
import type { MainFormDataType, NameTypeEvent, NameTypeMain } from '@/types';
import { sendDataOnMail } from '@/utils/sendEmailData';
import { sendDataToCRM } from '@/utils/sendCRMData';
import { useUser, useAddNotification } from '@/store/store';
import { userService } from '@/lib/services/userService';
import Loader from '../sharedUI/Loader/Loader';
import { usePathname } from 'next/navigation';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateProfession,
} from '@/utils/validateFormFields';

const MainForm: FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const isEventPage = pathname ? pathname.includes('event') : false;
  const locale = useLocale();
  const formRef = useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const user = useUser();
  const addNotification = useAddNotification();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<MainFormDataType>({
    name: { value: '', isValid: false },
    email: { value: '', isValid: false },
    phone: { value: '', isValid: false },
    profession: { value: '', isValid: false },
  });
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleData = (
    data: string,
    name: NameTypeMain | NameTypeEvent,
    isValid: boolean
  ) => {
    setFormData({ ...formData, [name]: { value: data, isValid } });
  };

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsSending(true);

    try {
      // Check if user exists, if not create a lead
      if (!user) {
        const leadData = {
          name: formData.name.value,
          email: formData.email.value,
          phone: formData.phone.value,
          profession: formData.profession.value,
          source: isEventPage ? 'event_registration' : 'callback_request',
          status: 'new',
          createdAt: new Date().toISOString()
        };
        
        await userService.createLead(leadData);
        
        addNotification({
          type: 'success',
          title: t('form.success.title'),
          message: t('form.success.message'),
          isRead: false
        });
      }

      // Also send to existing email/CRM systems
      await Promise.all([
        sendDataOnMail(formData).catch((err) => console.log(err)),
        sendDataToCRM(formData).catch((err) => console.log(err)),
      ]);
      
      setIsSent(true);
    } catch (error) {
      console.error('Form submission error:', error);
      addNotification({
        type: 'error',
        title: t('form.error.title'),
        message: t('form.error.message'),
        isRead: false
      });
    } finally {
      setIsSending(false);
    }
  };

  const onEnterHit = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      isButtonDisabled ? null : onSubmit();
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', onEnterHit);
    return () => window.removeEventListener('keypress', onEnterHit);
  }, [isButtonDisabled]);

  const validateMainPageForm = () => {
    !formData.email.isValid ||
    !formData.name.isValid ||
    !formData.profession.isValid ||
    !formData.phone.isValid ||
    !isChecked
      ? setIsButtonDisabled(true)
      : setIsButtonDisabled(false);
  };

  useEffect(() => {
    validateMainPageForm();
  }, [formData, isChecked]);

  return (
    <div className={styles.container}>
      <div ref={formRef} className={styles.formContainer}>
        {isSent ? (
          <>
            {isTabletOrMobile ? (
              <span className={styles.isSentTitle}>
                {t('form.sent.mobTitle')}
              </span>
            ) : null}
            <p className={styles.formSubmitted}>
              {t('form.sent.text')}
              <span>{t('form.sent.textColored')}</span>
            </p>
          </>
        ) : isSending ? (
          <Loader />
        ) : (
          <>
            <h2>
              {t('form.titleP1')}
              <br />
              <span>{t('form.titleP2')}</span>
              {t('form.titleP3')}
            </h2>
            <p>{t('form.subtitle')}</p>
            <form
              aria-label='Main Form'
              noValidate
              className={styles.form}
              onSubmit={onSubmit}
              action='submit'
            >
              <FormInput
                label={t('form.placeholderInputName')}
                setFormData={handleData}
                type='text'
                name='name'
                placeholder='Aaron Smith'
                validator={validateName}
              />
              <FormInput
                label={t('form.placeholderEmailName')}
                setFormData={handleData}
                type='email'
                name='email'
                placeholder='mitoderm@mail.com'
                validator={validateEmail}
              />
              <FormInput
                label={t('form.placeholderPhoneName')}
                setFormData={handleData}
                type='tel'
                name='phone'
                placeholder='586 412 924'
                validator={validatePhone}
              />
              <FormInput
                label={t('form.placeholderProfession')}
                setFormData={handleData}
                type='text'
                name='profession'
                placeholder={t('form.placeholderProfession')}
                validator={validateProfession}
              />
              <label
                className={`${styles.checkboxLabel} ${
                  locale === 'he' ? styles.he : ''
                }`}
              >
                {t('form.checkboxLabel')}
                <input
                  checked={isChecked}
                  onChange={() => setIsChecked((state) => !state)}
                  name='approve'
                  type='checkbox'
                  required
                />
                <div className={styles.customCheckbox} />
              </label>
              <Button
                disabled={isButtonDisabled}
                submit
                text={t(
                  isEventPage
                    ? 'buttons.reserveSeat'
                    : 'buttons.requestCallback'
                )}
              />
              <div
                className={`${styles.row} ${locale === 'he' ? styles.he : ''}`}
              >
                <Image
                  src='/images/lockIcon.svg'
                  width={14}
                  height={14}
                  alt='lock icon'
                />
                <p>{t('form.sharing')}</p>
              </div>
            </form>
          </>
        )}
      </div>
      {isTabletOrMobile && isSending ? null : isSent ? null : (
        <div className={styles.formImageContainer}>
          <Image
            className={styles.desktopImage}
            fill
            src='/images/formImage.png'
            alt='background with exosome'
          />
          <FormCloseButton />
        </div>
      )}
    </div>
  );
};

export default MainForm;
