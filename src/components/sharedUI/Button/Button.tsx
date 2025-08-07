'use client';
import { CSSProperties, FC, forwardRef } from 'react';
import styles from './Button.module.scss';
import { useRouter } from '@/i18n/routing';

interface Props {
  text: string;
  style?: CSSProperties;
  submit?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => any;
  formPage?: 'main' | 'event';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
}

const Button: FC<Props> = forwardRef<HTMLButtonElement, Props>(({
  text,
  style,
  submit = false,
  disabled = false,
  loading = false,
  onClick,
  formPage,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  ariaLabel,
  ariaDescribedBy,
  className,
}, ref) => {
  const router = useRouter();

  const openForm = (page: 'event' | 'main') => {
    if (page === 'event') router.push(`/event/form`);
    if (page === 'main') router.push(`/form`);
  };

  const handleClick = () => {
    if (disabled || loading) return;
    formPage ? openForm(formPage) : onClick ? onClick() : null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enhanced keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Fix hydration mismatch by ensuring consistent className generation
  const buttonClasses = [
    styles.button,
    variant && styles[variant],
    size && styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ').trim();

  return (
    <button
      ref={ref}
      type={submit ? 'submit' : 'button'}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={ariaLabel || text}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {loading && (
        <span className={styles.loadingSpinner} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.spinner}>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
        </span>
      )}
      
      {icon && iconPosition === 'left' && (
        <span className={styles.iconLeft} aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className={styles.buttonText}>
        {text}
      </span>
      
      {icon && iconPosition === 'right' && (
        <span className={styles.iconRight} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
