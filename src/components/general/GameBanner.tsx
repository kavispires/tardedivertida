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
        fallback={`${PUBLIC_URL.BANNERS}/em-breve.jpg`}
        className={className}
        preview={preview}
      />
    </figure>
  );
}
