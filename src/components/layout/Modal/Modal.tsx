'use client';
import { FC, useEffect, useCallback } from 'react';
import styles from './Modal.module.scss';
import useAppStore from '@/store/store';
import PrivatePolicy from '@/components/layout/PrivatePolicy/PrivatePolicy';
import Accessibility from '@/components/layout/Accessibility/Accessibility';

const Modal: FC = () => {
  // Only subscribe to the specific parts of the store we need
  const modalIsOpen = useAppStore((state) => state.modalIsOpen);
  const toggleModal = useAppStore((state) => state.toggleModal);
  const modalContent = useAppStore((state) => state.modalContent);
  
  const handleClose = useCallback((e: MouseEvent) => {
    const { target } = e;
    if ((target as HTMLDivElement).id === 'modal') toggleModal(false);
  }, [toggleModal]);

  useEffect(() => {
    if (modalIsOpen) {
      window.addEventListener('click', handleClose);
      return () => window.removeEventListener('click', handleClose);
    }
  }, [modalIsOpen, handleClose]);

  useEffect(() => {
    const body = document.querySelector('body');
    body && modalIsOpen
      ? body.classList.add('modalOpened')
      : body?.classList.remove('modalOpened');
    return () => body?.classList.remove('modalOpened');
  }, [modalIsOpen]);

  return (
    <div className={`${styles.container} ${modalIsOpen ? styles.opened : ''}`}>
      <div
        id='modal'
        className={`${styles.overlay} ${modalIsOpen ? styles.active : ''}`}
      />
      <div
        className={`${styles.content} ${
          modalIsOpen ? styles.contentActive : ''
        }`}
      >
        {modalIsOpen ? (
          modalContent === 'privatePolicy' ? (
            <PrivatePolicy />
          ) : (
            <Accessibility />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
