'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  FiUser, FiLock, FiMail, FiEye, FiEyeOff, FiShield,
  FiStar, FiGift, FiZap, FiHeart, FiArrowRight,
  FiLogIn, FiUserPlus, FiX
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import styles from './MemberLogin.module.scss';

interface MemberLoginProps {
  isOpen: boolean;
  onClose: () => void;
  showBenefits?: boolean;
  redirectPath?: string;
}

export default function MemberLogin({ 
  isOpen, 
  onClose, 
  showBenefits = true, 
  redirectPath = '/' 
}: MemberLoginProps) {
  const { data: session } = useSession();
  const t = useTranslations();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const memberBenefits = [
    {
      icon: <FiStar />,
      title: {
        en: 'Exclusive Products',
        he: 'מוצרים בלעדיים',
        ru: 'Эксклюзивные продукты'
      },
      description: {
        en: 'Access to members-only skincare solutions',
        he: 'גישה לפתרונות טיפוח בלעדיים לחברים',
        ru: 'Доступ к эксклюзивным средствам по уходу за кожей'
      },
      color: '#FFD700'
    },
    {
      icon: <FiGift />,
      title: {
        en: 'Special Discounts',
        he: 'הנחות מיוחדות',
        ru: 'Специальные скидки'
      },
      description: {
        en: 'Up to 25% off on all products',
        he: 'עד 25% הנחה על כל המוצרים',
        ru: 'До 25% скидки на все продукты'
      },
      color: '#FF6B6B'
    },
    {
      icon: <FiZap />,
      title: {
        en: 'Early Access',
        he: 'גישה מוקדמת',
        ru: 'Ранний доступ'
      },
      description: {
        en: 'Be first to try new innovations',
        he: 'היו הראשונים לנסות חדשנויות',
        ru: 'Первыми попробуйте новые инновации'
      },
      color: '#60A5FA'
    },
    {
      icon: <FiHeart />,
      title: {
        en: 'Personal Consultation',
        he: 'ייעוץ אישי',
        ru: 'Персональная консультация'
      },
      description: {
        en: 'Free skin analysis and recommendations',
        he: 'ניתוח עור וייעוץ בחינם',
        ru: 'Бесплатный анализ кожи и рекомендации'
      },
      color: '#EC4899'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Registration logic
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Create account
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Registration failed');
        }

        // Auto sign in after registration
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

      } else {
        // Login logic
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: redirectPath
        });

        if (result?.error) {
          throw new Error('Invalid credentials');
        }
      }

      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { 
        callbackUrl: redirectPath,
        redirect: false 
      });
      onClose();
    } catch (err) {
      setError('Google sign in failed');
    }
  };

  // If user is already logged in, show member status
  if (session) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className={styles.memberStatus}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={onClose}>
                <FiX />
              </button>
              
              <div className={styles.memberInfo}>
                <div className={styles.memberAvatar}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={60}
                      height={60}
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>
                
                <h2>Welcome, {session.user?.name || 'Member'}</h2>
                <p className={styles.memberLevel}>
                  <FiStar />
                  Premium Member
                </p>
                
                <div className={styles.memberActions}>
                  <button className={styles.profileBtn}>
                    <FiUser />
                    View Profile
                  </button>
                  
                  <button 
                    className={styles.logoutBtn}
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.loginModal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <FiX />
            </button>

            <div className={styles.modalContent}>
              {/* Left side - Benefits */}
              {showBenefits && (
                <div className={styles.benefitsSection}>
                  <div className={styles.benefitsHeader}>
                    <h2>
                      <FiShield />
                      Member Benefits
                    </h2>
                    <p>Join our exclusive community and unlock premium features</p>
                  </div>
                  
                  <div className={styles.benefitsList}>
                    {memberBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className={styles.benefitItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div 
                          className={styles.benefitIcon}
                          style={{ backgroundColor: benefit.color + '20', color: benefit.color }}
                        >
                          {benefit.icon}
                        </div>
                        <div className={styles.benefitContent}>
                          <h4>{benefit.title.en}</h4>
                          <p>{benefit.description.en}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right side - Login Form */}
              <div className={styles.formSection}>
                <div className={styles.formHeader}>
                  <h2>
                    {isRegistering ? (
                      <>
                        <FiUserPlus />
                        Create Account
                      </>
                    ) : (
                      <>
                        <FiLogIn />
                        Member Login
                      </>
                    )}
                  </h2>
                  <p>
                    {isRegistering 
                      ? 'Join our community and access exclusive benefits'
                      : 'Access your member benefits and exclusive content'
                    }
                  </p>
                </div>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                  {error && (
                    <div className={styles.errorMessage}>
                      {error}
                    </div>
                  )}

                  {isRegistering && (
                    <div className={styles.inputGroup}>
                      <div className={styles.inputWrapper}>
                        <FiUser className={styles.inputIcon} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                      <FiMail className={styles.inputIcon} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                      <FiLock className={styles.inputIcon} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {isRegistering && (
                    <div className={styles.inputGroup}>
                      <div className={styles.inputWrapper}>
                        <FiLock className={styles.inputIcon} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className={styles.spinner} />
                    ) : (
                      <>
                        {isRegistering ? 'Create Account' : 'Login'}
                        <FiArrowRight />
                      </>
                    )}
                  </button>
                </form>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <button
                  className={styles.googleButton}
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle />
                  Continue with Google
                </button>

                <div className={styles.formFooter}>
                  <p>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className={styles.switchButton}
                    >
                      {isRegistering ? 'Login here' : 'Create one'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}