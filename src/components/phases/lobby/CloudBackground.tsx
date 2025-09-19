import clsx from 'clsx';
import { sampleSize } from 'lodash';
import { motion, type MotionProps } from 'motion/react';
import { useMemo } from 'react';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { useGameAppearance } from 'components/session/GameInfoContext';
// Sass
import './CloudBackground.scss';

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

const CLOUDS = [0, 1, 2, 3, 4];
const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;
const X_POSITIONS = [10, 25, 40, 55, 70, 85];
const Y_POSITIONS = [10, 25, 40, 55, 70, 85];
const SCALES = [0.25, 0.3, 0.35, 0.4, 0.45, 0.5];
const DELAYS = [0, 0.5, 1, 1.5, 2];
const DURATIONS = [15, 20, 25, 30, 35];

type AnimationConfig = {
  xs: number[];
  ys: number[];
  scales: number[];
  delays: number[];
  durations: number[];
};

export function CloudBackground() {
  const gameAppearance = useGameAppearance();
  const cloudType = gameAppearance.clouds ?? 'cloud';
  const cloudAnimationType = gameAppearance.cloudsAnimationType ?? 'flow';
  const backgroundColor = gameAppearance.backgroundColor;

  const CloudTypeComponent = getCloudComponent(cloudType);

  const config = useMemo(() => {
    return {
      xs: sampleSize(X_POSITIONS, 5),
      ys: sampleSize(Y_POSITIONS, 5),
      scales: sampleSize(SCALES, 5),
      delays: sampleSize(DELAYS, 5),
      durations: sampleSize(DURATIONS, 5),
    };
  }, []);

  return (
    <div
      className={clsx('cloud-background', `cloud-background--${cloudType}`)}
      style={backgroundColor ? { backgroundColor } : {}}
    >
      {CLOUDS.map((id) => {
        return (
          <motion.div key={id} {...getAnimationProps(cloudAnimationType, id, config)}>
            <CloudTypeComponent index={id} type={cloudType} />
          </motion.div>
        );
      })}
    </div>
  );
}

const getAnimationProps = (type: string, id: number, config: AnimationConfig): MotionProps => {
  const randomScale = config.scales[id];
  const randomDuration = config.durations[id];
  const randomDelay = config.delays[id];
  const randomX = (config.xs[id] * SCREEN_WIDTH) / 100;
  const randomY = (config.ys[id] * SCREEN_HEIGHT) / 100;
  const orbitOriginX = SCREEN_WIDTH / 5 - 300; // Shift orbit to the left by 150px
  const orbitOriginY = SCREEN_HEIGHT / 2;

  if (type === 'falling') {
    return {
      initial: { x: randomX, y: -SCREEN_HEIGHT, scale: randomScale },
      animate: { y: SCREEN_HEIGHT + 300 },
      transition: {
        ease: 'linear',
        delay: randomDelay,
        duration: randomDuration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'loop',
        type: 'tween',
      },
    };
  }

  if (type === 'rising') {
    return {
      initial: { x: randomX, y: SCREEN_HEIGHT + 300, scale: randomScale },
      animate: { y: -300 },
      transition: {
        ease: 'linear',
        delay: randomDelay,
        duration: randomDuration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'loop',
        type: 'tween',
      },
    };
  }

  if (type === 'orbit') {
    return {
      initial: { rotate: 0, x: orbitOriginX, y: orbitOriginY, scale: randomScale },
      animate: { rotate: -360 },
      transition: {
        ease: 'linear',
        delay: randomDelay,
        duration: randomDuration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'loop',
        type: 'tween',
      },
    };
  }

  return {
    initial: { x: -SCREEN_WIDTH, y: randomY, scale: randomScale },
    animate: { x: SCREEN_WIDTH + 300 },
    transition: {
      ease: 'linear',
      delay: randomDelay,
      duration: randomDuration,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: 'loop',
      type: 'tween',
    },
  };
};
