import clsx from 'clsx';
// Utils
import { PUBLIC_URL } from 'utils/constants';

function SingleCloud({ type }: { type: string; index?: number }) {
  return (
    <div
      className="cloud-background__cloud"
      style={{
        backgroundImage: `url('${PUBLIC_URL.CLOUDS}${type}.png')`,
        backgroundPositionX: '0',
      }}
    ></div>
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
  if (type) {
    const plural = type.split('-cloud')?.[1];

    if (plural === 's') {
      return MultiCloud;
    }
  }
  return SingleCloud;
}

type CloudBackgroundProps = {
  cloudType?: string;
  backgroundColor?: string;
};

export function CloudBackground({ cloudType = 'cloud', backgroundColor }: CloudBackgroundProps) {
  const CloudTypeComponent = getCloudComponent(cloudType);

  const baseClass = 'cloud-background';

  return (
    <div
      className={clsx(baseClass, `${baseClass}--${cloudType}`)}
      style={backgroundColor ? { backgroundColor } : {}}
    >
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
