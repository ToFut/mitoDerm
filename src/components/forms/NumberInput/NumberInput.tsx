'use client';
import { FC, useEffect } from 'react';
import styles from './NumberInput.module.scss';
import { useTranslations } from 'next-intl';
import useAppStore from '@/store/store';

const NumberInput: FC = () => {
  const t = useTranslations();
  const numberOfTickets = useAppStore((state) => state.numberOfTickets);
  const setNumberOfTickets = useAppStore((state) => state.setNumberOfTickets);

  const handleChange = (arg: 'inc' | 'dec') => {
    if (arg === 'dec') {
      setNumberOfTickets(numberOfTickets <= 1 ? 1 : numberOfTickets - 1);
    }
    if (arg === 'inc') {
      setNumberOfTickets(numberOfTickets + 1);
    }
  };

  useEffect(() => {
    setNumberOfTickets(1);
  }, [setNumberOfTickets]); // Include setNumberOfTickets in dependencies

  return (
    <div className={styles.container}>
      <span>{t('form.numberTickets')}</span>
      <div className={styles.inputContainer}>
        <button type='button' onClick={() => handleChange('dec')}>
          -
        </button>
        <input type='number' readOnly value={numberOfTickets} min={1} />
        <button type='button' onClick={() => handleChange('inc')}>
          +
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
