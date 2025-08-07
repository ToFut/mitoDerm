import { FC, useEffect, useState } from 'react';
import styles from './FormInput.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import type { NameTypeMain, NameTypeEvent } from '@/types';

interface Props {
  validator: (data: string, t: any) => string;
  setFormData: (
    data: string,
    name: NameTypeMain | NameTypeEvent,
    isValid: boolean
  ) => void;
  name: NameTypeMain | NameTypeEvent;
  type: 'text' | 'tel' | 'email';
  label: string;
  placeholder: string;
}

const FormInput: FC<Props> = ({
  validator,
  setFormData,
  type,
  name,
  placeholder,
  label,
}) => {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const locale = useLocale();
  const t = useTranslations();

  const onChange = (data: string) => {
    let validatedData = '';
    if (name === 'phone') {
      validatedData = data.replace(/[^0-9+]/g, '');
    } else if (name === 'idNumber') {
      validatedData = data.replace(/[^0-9]/g, '');
    } else validatedData = data;
    setData(validatedData);
    setError(validator(data, t));
  };

  useEffect(() => {
    setFormData(data, name, !error.length ? true : false);
  }, [error, data, name, setFormData]);

  useEffect(() => {
    const input: HTMLInputElement | null =
      document.querySelector('input[type="tel"]');
    const handlePhoneNumber = () => {
      if (locale === 'he' && input?.value.startsWith('+')) {
        input.setSelectionRange(0, 0);
      }
    };
    if (locale === 'he' && type === 'tel') {
      input?.addEventListener('input', handlePhoneNumber);
    }
    return () => input?.removeEventListener('input', handlePhoneNumber);
  }, [locale, type]); // Include locale and type in dependencies since they're accessed in the effect

  return (
    <label className={styles.inputLabel}>
      {label}
      <input
        autoFocus={name === 'name'}
        dir={locale === 'he' ? 'rtl' : 'ltr'}
        className={error ? styles.error : ''}
        value={data}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        name={name}
        placeholder={placeholder}
        required
      />
      <span className={styles.errorText}>{error}</span>
    </label>
  );
};

export default FormInput;
