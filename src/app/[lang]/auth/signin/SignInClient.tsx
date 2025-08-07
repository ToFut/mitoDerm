'use client';

import { signIn, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './signin.module.scss';

export default function SignInClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profession: 'cosmetologist'
  });

  useEffect(() => {
    getSession().then((session) => {
      setSession(session);
      if (session) {
        // Don't redirect automatically, let user see their account
      }
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn('google');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Google sign-in is currently unavailable. Please use the Quick Sign Up or Detailed Registration options.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSignUp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email: 'quick@mitoderm.com',
        password: 'quick123',
        redirect: false,
      });
      
      if (result?.error) {
        setError('Quick sign-up failed');
      } else {
        router.push('/en');
      }
    } catch (error) {
      setError('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Call the real signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          name: registerData.name,
          phone: registerData.phone,
          profession: registerData.profession,
          clinic: '',
          address: ''
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Registration successful
      setShowRegisterModal(false);
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        profession: 'cosmetologist'
      });
      
      // Show success message and redirect
      alert('Account created successfully! You can now sign in.');
      router.push('/en');
      
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setSession(null);
  };

  const handleGoToDashboard = () => {
    router.push('/en');
  };

  return (
    <>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authContent}>
            {session?.user ? (
              // User is logged in - show account info
              <div className={styles.accountInfo}>
                <div className={styles.accountHeader}>
                  <div className={styles.userAvatar}>
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={80}
                        height={80}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {session.user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <h2>{session.user.name}</h2>
                    <p>{session.user.email}</p>
                    <span className={styles.accountStatus}>Active Account</span>
                  </div>
                </div>

                <div className={styles.accountActions}>
                  <button
                    onClick={handleGoToDashboard}
                    className={styles.dashboardButton}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
                    </svg>
                    Go to Dashboard
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className={styles.signOutButton}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              // User is not logged in - show sign up options
              <>
                <div className={styles.authHeader}>
                  <h2>Get Started</h2>
                  <p>Choose your preferred way to join</p>
                </div>

                <div className={styles.authButtons}>
                  {/* One-Click Quick Sign Up */}
                  <button
                    onClick={handleQuickSignUp}
                    disabled={isLoading}
                    className={styles.quickSignUpButton}
                  >
                    <div className={styles.buttonIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className={styles.buttonContent}>
                      <span className={styles.buttonTitle}>Quick Sign Up</span>
                      <span className={styles.buttonSubtitle}>Start in 1 click</span>
                    </div>
                  </button>

                  {/* Google OAuth */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className={`${styles.googleButton} ${styles.disabled}`}
                    title="Google OAuth temporarily unavailable"
                  >
                    <Image
                      src="/images/google-icon.svg"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    <span>Continue with Google (Temporarily Unavailable)</span>
                  </button>

                  {/* Detailed Registration */}
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    disabled={isLoading}
                    className={styles.registerButton}
                  >
                    <div className={styles.buttonIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Create Detailed Profile</span>
                  </button>
                </div>

                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.authFooter}>
                  <p>Already have an account? <button className={styles.linkButton}>Sign In</button></p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRegisterModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Create Your Profile</h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className={styles.closeButton}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleRegister} className={styles.registerForm}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="profession">Profession</label>
                  <select
                    id="profession"
                    value={registerData.profession}
                    onChange={(e) => setRegisterData({...registerData, profession: e.target.value})}
                    required
                  >
                    <option value="cosmetologist">Cosmetologist</option>
                    <option value="esthetician">Esthetician</option>
                    <option value="dermatologist">Dermatologist</option>
                    <option value="spa_owner">Spa Owner</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 