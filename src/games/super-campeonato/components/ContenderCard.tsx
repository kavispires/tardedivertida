import { Image } from 'antd';
import clsx from 'clsx';
import { useLanguage } from 'hooks';
import { PUBLIC_URL } from 'utils/constants';

type ContenderCardProps = {
  size: number;
  overlayColor: string;
  contender: WContender;
  className?: string;
};

export function ContenderCard({ size, overlayColor, contender, className }: ContenderCardProps) {
  const { language } = useLanguage();

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
        src={`${PUBLIC_URL.IN_GAME}/${contender.id}.jpg`}
        width={size}
        className="w-contender-image"
        fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
      />
    </div>
  );
}
