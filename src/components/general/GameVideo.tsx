import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Sass
import './GameVideo.scss';

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

export function GameVideo({
  gameName,
  width,
  title,
  className,
  children,
  showLogo = true,
  static: isStatic = false,
}: GameVideoProps) {
  const { language, dualTranslate } = useLanguage();

  const logoHeight = width / 1.5; // Logo width/height ratio is 1.5
  const backgroundHeight = logoHeight;

  return (
    <figure
      className={clsx('game-video', className)}
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
        className="game-video__video"
      >
        <source
          src={`${PUBLIC_URL.VIDEOS}${gameName}.mp4`}
          type="video/mp4"
        />
      </video>

      {showLogo && (
        <motion.img
          src={`${PUBLIC_URL.LOGOS}logo-${gameName}-${language}.svg`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${PUBLIC_URL.LOGOS}/logo-em-breve-${language}.svg`;
          }}
          alt={`${dualTranslate(title ?? { en: '', pt: '' })} logo`}
          className="game-video__logo"
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
