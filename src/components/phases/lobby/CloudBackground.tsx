import clsx from 'clsx';
// Utils
import { PUBLIC_URL } from 'utils/constants';

function SingleCloud({ type, index }: { type: string; index?: number }) {
  return (
    <div className={`"cloud-background__cloud cloud-background__cloud--${index}`}>
      <img src={`${PUBLIC_URL.CLOUDS}${type}.png`} alt="cloud" />
    </div>
  );
}

const cloudData = [
  {
    backgroundPositionX: '0',
  },
  {
    backgroundPositionX: '-300px',
  },
  {
    backgroundPositionX: '-600px',
  },
  {
    backgroundPositionX: '-900px',
  },
  {
    backgroundPositionX: '-1200px',
  },
];

function MultiCloud({ type, index }: { type: string; index: number }) {
  return (
    <div
      className="cloud-background__cloud"
      style={{
        backgroundImage: `url('${PUBLIC_URL.CLOUDS}${type}.png')`,
        ...cloudData[index],
      }}
    ></div>
  );
}

function getCloudComponent(type: string) {
  switch (type) {
    case 'eye-cloud':
    case 'monster-eye-cloud':
    case 'phone-cloud':
    case 'retro-cloud':
    case 'sheep-cloud':
    case 'speech-cloud':
    case 'clover-cloud':
      return SingleCloud;
    case 'artsy-clouds':
    case 'book-clouds':
    case 'crime-clouds':
    case 'halloween-clouds':
    case 'letter-clouds':
    case 'one-clouds':
    case 'sky-clouds':
      return MultiCloud;
    default:
      return SingleCloud;
  }
}

function getCloudFileName(gameCode: string) {
  return (
    {
      A: 'artsy-clouds',
      C: 'book-clouds',
      D: 'crime-clouds',
      E: 'cyber-cloud',
      G: 'sky-clouds',
      H: 'crime-clouds',
      L: 'phone-cloud',
      M: 'sheep-cloud',
      N: 'halloween-clouds',
      O: 'retro-cloud',
      P: 'speech-cloud',
      R: 'monster-eye-cloud',
      S: 'sky-clouds',
      T: 'eye-cloud',
      U: 'one-clouds',
      X: 'letter-clouds',
      Y: 'clover-cloud',
    }[gameCode] ?? 'cloud'
  );
}

type CloudBackgroundProps = {
  gameCode?: string;
};

export function CloudBackground({ gameCode = 'Z' }: CloudBackgroundProps) {
  const cloudType = getCloudFileName(gameCode);
  const CloudTypeComponent = getCloudComponent(cloudType);

  const baseClass = 'cloud-background';

  return (
    <div className={clsx(baseClass, `${baseClass}--${cloudType}`)}>
      <div className="cloud-background__animation-0">
        <CloudTypeComponent index={0} type={cloudType} />
      </div>

      <div className="cloud-background__animation-1">
        <CloudTypeComponent index={1} type={cloudType} />
      </div>

      <div className="cloud-background__animation-2">
        <CloudTypeComponent index={2} type={cloudType} />
      </div>

      <div className="cloud-background__animation-3">
        <CloudTypeComponent index={3} type={cloudType} />
      </div>

      <div className="cloud-background__animation-4">
        <CloudTypeComponent index={4} type={cloudType} />
      </div>
    </div>
  );
}
