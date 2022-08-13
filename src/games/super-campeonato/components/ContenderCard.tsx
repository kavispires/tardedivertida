import clsx from 'clsx';
// Ant Design resources
import { Image } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { PUBLIC_URL } from 'utils/constants';

type ContenderCardProps = {
  size: number;
  overlayColor: string;
  contender: WContender | WBracket;
  className?: string;
};

export function ContenderCard({ size, overlayColor, contender, className }: ContenderCardProps) {
  const { language } = useLanguage();

  const imageURL = contender.id.replace(/-/g, '/');

  return (
    <div className={clsx('w-contender', className)} style={{ width: `${size}px` }}>
      <span className="w-contender-name">{contender.name[language]}</span>
      <img
        src={`${PUBLIC_URL.IN_GAME}/w-overlay-${overlayColor}.png`}
        className="w-contender-overlay"
        alt="contender"
        style={{ width: `${size}px` }}
      />
      <Image
        src={`${process.env.REACT_APP_TD_IMAGES_URL}${imageURL}.jpg`}
        width={size}
        className="w-contender-image"
        fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
        alt={contender.name[language]}
      />
    </div>
  );
}
