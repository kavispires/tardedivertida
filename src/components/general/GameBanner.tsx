import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';

type BannerProps = {
  /**
   * Display title of the game
   */
  title?: DualLanguageValue;
  /**
   * Name (collection key) of the game
   */
  gameName?: string;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Determine if image should be able to be previewed
   */
  preview?: boolean;
};

export function GameBanner({ title, gameName, className, preview }: BannerProps) {
  const { language } = useLanguage();

  return (
    <figure>
      <Image
        alt={title?.[language]}
        src={`${PUBLIC_URL.BANNERS}${gameName}-${language}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
        className={className}
        preview={preview}
      />
    </figure>
  );
}

type GameStripProps = {
  /**
   * Name (collection key) of the game
   */
  gameName: string;
  /**
   *
   */
  width: number;
  /**
   * Custom class name
   */
  className?: string;
  /**
   *
   */
  title: DualLanguageValue;
  /**
   *
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
};

export function GameStrip({
  gameName,
  width,
  title,
  stripWidth = '100%',
  className,
  children,
  showLogo = true,
}: GameStripProps) {
  const { language, dualTranslate } = useLanguage();

  const logoHeight = width / 1.5; // Logo width/height ratio is 1.5
  const backgroundHeight = logoHeight;

  return (
    <div
      style={{
        width: typeof stripWidth === 'number' ? `${stripWidth}px` : stripWidth,
        minWidth: `${width}px`,
        height: `${backgroundHeight}px`,
        position: 'relative',
        overflow: 'hidden',
      }}
      className={className}
    >
      <img
        src={`${PUBLIC_URL.STRIPS}strip-${gameName}.jpg`}
        alt={`${dualTranslate(title)} background`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <motion.img
        src={`${PUBLIC_URL.LOGOS}logo-${gameName}-${language}.svg`}
        alt={`${dualTranslate(title)} logo`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${width}px`,
          height: `${logoHeight}px`,
          opacity: showLogo ? 1 : 0,
          transition: 'opacity 0.5s',
        }}
        animate={{
          transform: ['translate(-50%, -50%)', 'translate(-50%, -45%)', 'translate(-50%, -50%)'],
          transition: { duration: 7, repeat: Number.POSITIVE_INFINITY },
        }}
      />
      {children}
    </div>
  );
}
