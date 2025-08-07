'use client';
import { CSSProperties, FC } from 'react';
import styles from './DotPagination.module.scss';
import useAppStore from '@/store/store';
import Dot from './Dot/Dot';

interface Props {
  count: number;
  style?: CSSProperties;
  colored?: boolean;
  gallery?: boolean;
  intro?: boolean;
}

const DotPagination: FC<Props> = ({
  colored,
  count,
  style,
  gallery,
  intro,
}) => {
  const galleryPage = useAppStore((state) => state.galleryPage);
  const introPage = useAppStore((state) => state.introPage);
  const arr = Array.from(Array(count).keys());
  return (
    <div style={style} className={styles.container}>
      {arr.map((item: any, i: number) => (
        <Dot
          gallery={gallery}
          colored={colored}
          key={i}
          index={i}
          active={intro ? introPage === i : galleryPage === i}
          intro={intro}
        />
      ))}
    </div>
  );
};

export default DotPagination;
