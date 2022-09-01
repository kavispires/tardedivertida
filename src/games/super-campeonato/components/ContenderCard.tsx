import clsx from 'clsx';
// Ant Design resources
import { Image } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
import { useBlurCards } from 'hooks/useBlurCards';

type ContenderCardProps = {
  size: number;
  overlayColor: string;
  contender: WContender | WBracket;
  className?: string;
  hideName?: boolean;
};

export function ContenderCard({ size, overlayColor, contender, className, hideName }: ContenderCardProps) {
  const { language } = useLanguage();
  const { shouldBeBlurred } = useBlurCards();

  const isBlurred = shouldBeBlurred(contender.id);

  const imageURL = contender.id.replace(/-/g, '/');

  return (
    <div className={clsx('w-contender', className)} style={{ width: `${size}px` }}>
      {!hideName && <span className="w-contender-name">{contender.name[language]}</span>}
      <img
        src={`${PUBLIC_URL.IN_GAME}/w-overlay-${overlayColor}.png`}
        className="w-contender-overlay"
        alt="contender"
        style={{ width: `${size}px` }}
      />
      <Image
        src={`${process.env.REACT_APP_TD_IMAGES_URL}${imageURL}.jpg`}
        width={size}
        className={clsx('w-contender-image', isBlurred && 'w-contender-image--blur')}
        fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
        alt={contender.name[language]}
      />
    </div>
  );
}
