import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Sass
import styles from './GameBanner.module.scss';

type BannerProps = {
  /**
   * Name (collection key) of the game
   */
  gameName: string;
  /**
   * Width of the strip
   */
  width: number;
  /**
   * Display title of the game
   */
  title?: DualLanguageValue;
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

export function GameBanner({
  title,
  gameName,
  className,
  width,
  showLogo = true,
  children,
  static: isStatic = false,
}: BannerProps) {
  const { language, dualTranslate } = useLanguage();
  const logoHeight = width / 1.5; // Logo width/height ratio is 1.5
  const backgroundHeight = logoHeight;

  return (
    <figure
      className={clsx(styles.gameBanner, className)}
      style={{
        width,
        minWidth: `${width}px`,
        height: `${backgroundHeight}px`,
      }}
    >
      <img
        src={`${PUBLIC_URL.BANNERS}${gameName}.jpg`}
        alt={`${title?.[language]} background`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${PUBLIC_URL.BANNERS}/em-breve.jpg`;
        }}
        className={styles.gameBannerImage}
      />

      <motion.img
        src={`${PUBLIC_URL.LOGOS}logo-${gameName}-${language}.svg`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${PUBLIC_URL.LOGOS}/logo-em-breve-${language}.svg`;
        }}
        alt={`${dualTranslate(title ?? { en: '', pt: '' })} logo`}
        className={clsx(styles.gameBannerLogo, !showLogo && styles.gameBannerLogoHidden)}
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
      {children}
    </figure>
  );
}

type GameStripProps = {
  /**
   * Name (collection key) of the game
   */
  gameName: string;
  /**
   * Title of the game
   */
  title: DualLanguageValue;
  /**
   * Width of the game card/logo
   */
  width: number;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Width of the strip
   */
  stripWidth?: number | string;
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

export function GameStrip({
  gameName,
  width,
  title,
  stripWidth = '100%',
  className,
  children,
  showLogo = true,
  static: isStatic = false,
}: GameStripProps) {
  const { language, dualTranslate } = useLanguage();
  const baseUrl = useTDBaseUrl('assets');

  const logoHeight = width / 1.5; // Logo width/height ratio is 1.5
  const backgroundHeight = logoHeight;

  return (
    <figure
      className={clsx(styles.gameStrip, className)}
      style={{
        width: typeof stripWidth === 'number' ? `${stripWidth}px` : stripWidth,
        minWidth: `${width}px`,
        height: `${backgroundHeight}px`,
      }}
    >
      <img
        src={`${baseUrl}/strips/strip-${gameName}.jpg`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${baseUrl}/strips/strip-em-breve.jpg`;
        }}
        alt={`${dualTranslate(title)} background`}
        className={styles.gameStripImage}
      />
      <motion.img
        src={`${PUBLIC_URL.LOGOS}logo-${gameName}-${language}.svg`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${PUBLIC_URL.LOGOS}/logo-em-breve-${language}.svg`;
        }}
        alt={`${dualTranslate(title)} logo`}
        className={clsx(styles.gameStripLogo, !showLogo && styles.gameStripLogoHidden)}
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
      {children}
    </figure>
  );
}
