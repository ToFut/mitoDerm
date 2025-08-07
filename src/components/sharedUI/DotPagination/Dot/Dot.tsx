'use client';
import { FC } from 'react';
import styles from './Dot.module.scss';
import useAppStore from '@/store/store';

type DotProps = {
  index: number;
  active?: boolean;
  colored?: boolean;
  gallery?: boolean;
  intro?: boolean;
};

const Dot: FC<DotProps> = ({ colored, index, active, gallery, intro }) => {
  const setGalleryPage = useAppStore((state) => state.setGalleryPage);
  const setIntroPage = useAppStore((state) => state.setIntroPage);

  const handleClick = () => {
    intro && setIntroPage(index);
    gallery && setGalleryPage(index);
  };
  return (
    <button
      aria-current={active}
      type='button'
      name='pagination dot'
      aria-label='pagination dot'
      onClick={handleClick}
      className={`${colored ? styles.colored : ''} ${
        active ? styles.dotActive : styles.dot
      }`}
    />
  );
};

export default Dot;
