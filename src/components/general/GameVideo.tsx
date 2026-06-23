import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from '@utils/constants';
// Sass
import styles from './GameVideo.module.scss';

type GameVideoProps = {
  /**
   * Name (collection key) of the game
   */
  gameName: string;
  /**
   * Title of the game
   */
  title?: DualLanguageValue;
  /**
   * Width of the game card/logo
   */
  width: number;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * any additional content
   */
  children?: ReactNode;
  /**
   * Show logo
   */
  showLogo?: boolean;
  /**
   * When static, the logo will not animate
   */
  static?: boolean;
};

/**
 * Component that displays a game video with animated logo overlay and optional title
 */
export function GameVideo({
  gameName,
  width,
  title,
  className,
  children,
  showLogo = true,
  static: isStatic = false,
}: GameVideoProps) {
  const { language, translate } = useLanguage();
  const BASE_URL = useTDBaseUrl('assets');

  const logoHeight = width / 1.5; // Logo width/height ratio is 1.5
  const backgroundHeight = logoHeight;

  return (
    <figure
      className={clsx(styles.gameVideo, className)}
      style={{
        width: `${width}px`,
        minWidth: `${width}px`,
        height: `${backgroundHeight}px`,
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.gameVideoVideo}
      >
        <source
          src={`${BASE_URL}/videos/${gameName}.mp4`}
          type="video/mp4"
        />
      </video>

      {showLogo && (
        <motion.img
          src={`${PUBLIC_URL.LOGOS}logo-${gameName}-${language}.svg`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${PUBLIC_URL.LOGOS}/logo-em-breve-${language}.svg`;
          }}
          alt={`${translate(title ?? { en: '', pt: '' })} logo`}
          className={styles.gameVideoLogo}
          style={{
            width: `${width}px`,
            height: `${logoHeight}px`,
          }}
          animate={
            isStatic
              ? undefined
              : {
                  transform: ['translate(-50%, -50%)', 'translate(-50%, -45%)', 'translate(-50%, -50%)'],
                  transition: { duration: 7, repeat: Number.POSITIVE_INFINITY },
                }
          }
        />
      )}
      {children}
    </figure>
  );
}
