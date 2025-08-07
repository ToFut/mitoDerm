import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import styles from './Price.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import useAppStore from '@/store/store';

type ErrorMessageType = 'default' | 'error' | 'success';

const initialErrorStatus: ErrorMessageType = 'default';

interface Props {
  total: string;
  setTotal: Dispatch<SetStateAction<string>>;
}

const Price: FC<Props> = ({ total, setTotal }) => {
  const [value, setValue] = useState<string>('');
  const [errorMessage, setErrorMessage] =
    useState<ErrorMessageType>(initialErrorStatus);
  const t = useTranslations();
  const locale = useLocale();
  const currentPrice = process.env.NEXT_PUBLIC_EVENT_PRICE;
  const numberOfTickets = useAppStore((state) => state.numberOfTickets);
  const discountModifier = useAppStore((state) => state.discountModifier);
  const setDiscountModifier = useAppStore((state) => state.setDiscountModifier);

  useEffect(() => {
    setValue('');
    setDiscountModifier(1);
    setErrorMessage(initialErrorStatus);
  }, [setDiscountModifier]); // Include setDiscountModifier in dependencies

  const handleClick = () => {
    if (value === process.env.NEXT_PUBLIC_EVENT_PROMOCODE) {
      setErrorMessage('success');
      setDiscountModifier(0.9);
    } else if (value === process.env.NEXT_PUBLIC_EVENT_PROMOCODE_TEST) {
      setErrorMessage('success');
      setDiscountModifier(0.01);
    } else {
      setErrorMessage('error');
      setDiscountModifier(1);
    }
  };

  useEffect(() => {
    if (errorMessage !== 'default') {
      const timer = setTimeout(() => setErrorMessage(initialErrorStatus), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    const result = parseInt(currentPrice || '1500');
    setTotal(result.toString());
  }, [numberOfTickets, currentPrice]); // setTotal is stable and doesn't need to be in dependencies

  return (
    <div className={styles.container}>
      <div className={styles.totalBox}>
        <span className={styles.total}>{t('form.total')}</span>
        <span
          className={`${styles.amount} ${locale === 'he' ? styles.he : ''}`}
        >
          <span>&#8362; </span>
          {`${(parseInt(total) * numberOfTickets * discountModifier)
            .toFixed(2)
            .replace('.', ',')}`}
        </span>
      </div>
      <div className={styles.promoBox}>
        <span className={styles.promo}>{t('form.promo')}</span>
        <div className={`${styles.inputBox} ${locale === 'he' && styles.he}`}>
          <input
            name='promo'
            placeholder='Promo432'
            type='text'
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value.length <= 15
                  ? e.target.value
                  : e.target.value.substring(0, 10)
              )
            }
          />
          <button onClick={handleClick} type='button'>
            {t('form.apply')}
          </button>
        </div>
        <span
          className={`${styles.message} ${
            discountModifier === 0.9 || 0.1 ? styles.success : ''
          } ${
            errorMessage === 'default'
              ? ''
              : errorMessage === 'error'
              ? styles.error
              : styles.success
          }`}
        >
          {errorMessage === 'default'
            ? discountModifier === 0.9 && t('form.success')
            : errorMessage === 'error'
            ? t('form.wrongPromo')
            : t('form.success')}
        </span>
      </div>
    </div>
  );
};

export default Price;
