import clsx from 'clsx';
// Utils
import { PUBLIC_URL } from '../../../utils/constants';

function SingleCloud({ type, index }: { type: string; index?: number }) {
  return (
    <div className={`"cloud-background__cloud cloud-background__cloud--${index}`}>
      <img src={`${PUBLIC_URL.CLOUDS}${type}.png`} alt="cloud" />
    </div>
  );
}

function MultiCloud({ type, index }: { type: string; index?: number }) {
  return (
    <div className={`"cloud-background__cloud cloud-background__cloud--${index}`}>
      <img src={`${PUBLIC_URL.CLOUDS}${type}-${index}.png`} alt="cloud" />
    </div>
  );
}

function getCloudComponent(type: string) {
  switch (type) {
    case 'eye-cloud':
    case 'monster-eye-cloud':
    case 'retro-cloud':
    case 'sheep-cloud':
    case 'speech-cloud':
      return SingleCloud;
    case 'artsy-cloud':
    case 'book-cloud':
    case 'detective-cloud':
    case 'letter-cloud':
    case 'one-cloud':
    case 'sky-cloud':
      return MultiCloud;
    default:
      return SingleCloud;
  }
}

function getCloudFileName(gameCode: string) {
  return (
    {
      A: 'artsy-cloud',
      C: 'book-cloud',
      D: 'detective-cloud',
      E: 'cyber-cloud',
      M: 'sheep-cloud',
      O: 'retro-cloud',
      P: 'speech-cloud',
      R: 'monster-eye-cloud',
      S: 'sky-cloud',
      T: 'eye-cloud',
      U: 'one-cloud',
      X: 'letter-cloud',
    }[gameCode] ?? 'cloud'
  );
}

type CloudBackgroundProps = {
  gameCode?: string;
};

export function CloudBackground({ gameCode = 'Z' }: CloudBackgroundProps) {
  const cloudType = getCloudFileName(gameCode);
  const TypeComponent = getCloudComponent(cloudType);

  const baseClass = 'cloud-background';

  return (
    <div className={clsx(baseClass, `${baseClass}--${cloudType}`)}>
      <div className="cloud-background__animation-1">
        <TypeComponent index={0} type={cloudType} />
      </div>

      <div className="cloud-background__animation-2">
        <TypeComponent index={1} type={cloudType} />
      </div>

      <div className="cloud-background__animation-3">
        <TypeComponent index={2} type={cloudType} />
      </div>

      <div className="cloud-background__animation-4">
        <TypeComponent index={3} type={cloudType} />
      </div>

      <div className="cloud-background__animation-5">
        <TypeComponent index={4} type={cloudType} />
      </div>
    </div>
  );
}
