'use client';
import { FC, FormEvent, useState, useEffect, useRef, useCallback } from 'react';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateId,
} from '@/utils/validateFormFields';
import styles from './Form.module.scss';
import Image from 'next/image';
import Button from '../sharedUI/Button/Button';
import { useLocale, useTranslations } from 'next-intl';
import FormInput from './FormInput/FormInput';
import { useMediaQuery } from 'react-responsive';
import useAppStore from '@/store/store';
import type { EventFormDataType } from '@/types';
import Loader from '../sharedUI/Loader/Loader';
import NumberInput from './NumberInput/NumberInput';
import Price from './Price/Price';
import FormCloseButton from './FormCloseButton/FormCloseButton';
import { usePathname } from 'next/navigation';
import { sendPaymentDataToCRM } from '@/utils/sendPayment';
import type { NameTypeMain, NameTypeEvent } from '@/types';
import { useUser, useAddNotification } from '@/store/store';
import { eventService } from '@/lib/services/eventService';
import { orderService } from '@/lib/services/orderService';

const EventForm: FC = () => {
  const numberOfTickets = useAppStore((state) => state.numberOfTickets);
  const discountModifier = useAppStore((state) => state.discountModifier);
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
  const [formData, setFormData] = useState<EventFormDataType>({
    name: { value: '', isValid: false },
    email: { value: '', isValid: false },
    phone: { value: '', isValid: false },
    idNumber: { value: '', isValid: false },
  });
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleData = (
    data: string,
    name: NameTypeEvent | NameTypeMain,
    isValid: boolean
  ) => {
    setFormData({ ...formData, [name]: { value: data, isValid } });
  };

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsSending(true);
    
    try {
      const data = {
        ...formData,
        totalPrice,
        quantity: numberOfTickets,
        discount: discountModifier,
        lang: locale,
      };

      // Register for event in our system
      const eventId = 'current-event'; // This should come from context or props
      const registrationData = {
        eventId,
        userId: user?.id || null,
        guestInfo: !user ? {
          name: formData.name.value,
          email: formData.email.value,
          phone: formData.phone.value,
          idNumber: formData.idNumber.value
        } : null,
        numberOfTickets,
        totalAmount: parseFloat(totalPrice),
        status: 'pending_payment',
        registrationDate: new Date().toISOString()
      };

      const registration = await eventService.registerForEvent(
        eventId,
        user?.id || 'guest',
        parseFloat(totalPrice),
        'Event registration from form'
      );
      
      // Send to existing payment system
      const paymentResponse = await sendPaymentDataToCRM(data);
      
      addNotification({
        type: 'success',
        title: t('event.registration.success'),
        message: t('event.registration.successMessage'),
        isRead: false
      });
      
      setIsSent(true);
      
      if (paymentResponse.pay_url) {
        window.location.href = paymentResponse.pay_url;
      }
    } catch (error) {
      console.error('Event registration error:', error);
      addNotification({
        type: 'error',
        title: t('event.registration.error'),
        message: t('event.registration.errorMessage'),
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
  }, []); // Remove isButtonDisabled dependency as it's not needed for event listener setup

  const validatePageForm = useCallback(() => {
    !formData.email.isValid ||
    !formData.name.isValid ||
    !formData.phone.isValid ||
    !formData.idNumber.isValid ||
    !isChecked
      ? setIsButtonDisabled(true)
      : setIsButtonDisabled(false);
  }, [formData, isChecked]);

  useEffect(() => {
    validatePageForm();
  }, [validatePageForm]);

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
            <h2 style={{ marginBottom: 20 }}>{t('form.eventTitle')}</h2>
            {locale === 'he' && (
              <p
                style={{
                  marginBottom: 25,
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#555',
                  textAlign: 'right',
                }}
              >
                🌟 הצטרפי למפגש אינטימי ומעורר השראה! בואי לגלות את הטכנולוגיה
                החדשנית שהייתה עד עכשיו רק בידי רופאים, ולהכיר קוסמטיקאיות
                מקצועיות מדהימות כמוך ותקבלי הכשרה מעשית וידע חדשני שישנה את
                הקליניקה שלך.
                <br />☕ אווירה מפנקת עם ארוחת בוקר מיוחדת, מתנות מפתיעות והרבה
                השראה! את מגיעה לאירוע הזה! 💕
              </p>
            )}
            <form
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
                label={t('form.placeholderInputID')}
                setFormData={handleData}
                type='text'
                name='idNumber'
                placeholder={t('form.placeholderInputID')}
                validator={validateId}
              />
              <NumberInput />
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
              <Price total={totalPrice} setTotal={setTotalPrice} />
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
      {isTabletOrMobile ? null : (
        <div className={styles.formImageContainer}>
          <video
            className={styles.desktopVideo}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src='/videos/mitovideomobile.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <FormCloseButton />
        </div>
      )}
    </div>
  );
};

export default EventForm;
