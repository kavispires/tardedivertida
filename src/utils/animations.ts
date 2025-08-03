import type { Easing, Variants } from 'framer-motion';

const AnimationTypes = {
  // Attention Seekers
  BLINK: 'blink' as const,
  BOUNCE: 'bounce' as const,
  FLOAT: 'float' as const,
  FLASH: 'flash' as const,
  HEAD_SHAKE: 'headShake' as const,
  HEART_BEAT: 'heartBeat' as const,
  PULSE: 'pulse' as const,
  RUBBER_BAND: 'rubberBand' as const,
  SHAKE: 'shake' as const,
  SHAKE_X: 'shakeX' as const,
  SHAKE_Y: 'shakeY' as const,
  SWING: 'swing' as const,
  TADA: 'tada' as const,
  // Bounce
  BOUNCE_IN: 'bounceIn' as const,
  BOUNCE_OUT: 'bounceOut' as const,
  // Fading
  FADE_IN: 'fadeIn' as const,
  FADE_OUT: 'fadeOut' as const,
  // Flip
  FLIP_IN_X: 'flipInX' as const,
  FLIP_IN_Y: 'flipInY' as const,
  // Light Speed
  LIGHT_SPEED_IN_LEFT: 'lightSpeedInLeft' as const,
  // Slide
  SLIDE_IN_UP: 'slideInUp' as const,
  SLIDE_IN_DOWN: 'slideInDown' as const,
  SLIDE_IN_LEFT: 'slideInLeft' as const,
  SLIDE_IN_RIGHT: 'slideInRight' as const,
  // Zoom
  ZOOM_IN: 'zoomIn' as const,
  ZOOM_IN_DOWN: 'zoomInDown' as const,
  ZOOM_OUT: 'zoomOut' as const,
} as const;

const AnimationTypesRate = {
  [AnimationTypes.BLINK]: 1.5,
  [AnimationTypes.BOUNCE]: 0.75,
  [AnimationTypes.FLOAT]: 1,
  [AnimationTypes.FLASH]: 1,
  [AnimationTypes.HEAD_SHAKE]: 0.75,
  [AnimationTypes.HEART_BEAT]: 0.75,
  [AnimationTypes.PULSE]: 0.75,
  [AnimationTypes.RUBBER_BAND]: 0.75,
  [AnimationTypes.SHAKE]: 0.75,
  [AnimationTypes.SHAKE_X]: 0.75,
  [AnimationTypes.SHAKE_Y]: 0.75,
  [AnimationTypes.SWING]: 0.75,
  [AnimationTypes.TADA]: 0.75,
  [AnimationTypes.BOUNCE_IN]: 0.75,
  [AnimationTypes.BOUNCE_OUT]: 0.75,
  [AnimationTypes.FADE_IN]: 0.75,
  [AnimationTypes.FADE_OUT]: 0.75,
  [AnimationTypes.FLIP_IN_X]: 0.75,
  [AnimationTypes.FLIP_IN_Y]: 0.75,
  [AnimationTypes.LIGHT_SPEED_IN_LEFT]: 0.75,
  [AnimationTypes.SLIDE_IN_UP]: 0.75,
  [AnimationTypes.SLIDE_IN_DOWN]: 0.75,
  [AnimationTypes.SLIDE_IN_LEFT]: 0.75,
  [AnimationTypes.SLIDE_IN_RIGHT]: 0.75,
  [AnimationTypes.ZOOM_IN]: 0.75,
  [AnimationTypes.ZOOM_IN_DOWN]: 0.75,
  [AnimationTypes.ZOOM_OUT]: 0.75,
};

const SpeedValues = {
  normal: 1,
  slow: 2,
  slower: 4,
  fast: 0.5,
  faster: 0.25,
};

type AnimationType = (typeof AnimationTypes)[keyof typeof AnimationTypes];

type SpeedType = keyof typeof SpeedValues;

interface AnimationOptions {
  delay?: number;
  speed?: SpeedType;
  duration?: number;
  repeat?: number;
  infinite?: boolean;
  ease?: Easing;
}

const getAnimation = (type: AnimationType, options: AnimationOptions = {}): Variants => {
  const { delay = 0, speed = 'normal', duration, repeat = 0, infinite = false, ease } = options;

  const repeatValue = infinite ? Number.POSITIVE_INFINITY : repeat;
  const resolvedDuration = duration ?? SpeedValues[speed] * AnimationTypesRate[type];

  const animations: Record<AnimationType, Variants> = {
    [AnimationTypes.BLINK]: {
      animate: {
        opacity: [0.25, 1, 0.25],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.BOUNCE]: {
      animate: {
        transform: [
          'translateZ(0)',
          'translate3d(0, -30px, 0) scaleY(1.1)',
          'translateZ(0)',
          'translate3d(0, -15px, 0) scaleY(1.05)',
          'translateZ(0) scaleY(0.95)',
          'translate3d(0, -4px, 0) scaleY(1.02)',
          'translateZ(0)',
        ],
        transition: {
          ease: ease ?? [
            [0.215, 0.61, 0.355, 1],
            [0.755, 0.05, 0.855, 0.06],
            [0.755, 0.05, 0.855, 0.06],
            [0.215, 0.61, 0.355, 1],
          ],
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.FLOAT]: {
      animate: {
        y: [0, -10, 0],
        transition: { delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.FLASH]: {
      animate: {
        opacity: [1, 0, 1, 0, 1],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.HEAD_SHAKE]: {
      animate: {
        rotate: [0, -6, 6, -3, 3, -1, 1, 0],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.HEART_BEAT]: {
      animate: {
        scale: [1, 1.3, 1, 1.3, 1],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.PULSE]: {
      animate: {
        scale: [1, 1.05, 1],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.RUBBER_BAND]: {
      animate: {
        transform: [
          'scale3d(1, 1, 1)',
          'scale3d(1.4, 0.55, 1)',
          'scale3d(0.75, 1.25, 1)',
          'scale3d(1.25, 0.85, 1)',
          'scale3d(1, 1, 1)',
        ],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.SHAKE]: {
      animate: {
        x: [0, -10, 10, -10, 10, 0],
        y: [0, 5, -5, 5, -5, 0],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.SHAKE_X]: {
      animate: {
        x: [0, -10, 10, -10, 10, -10, 10, -10, 0],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.SHAKE_Y]: {
      animate: {
        y: [0, -10, 10, -10, 10, -10, 10, -10, 0],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.SWING]: {
      animate: {
        rotate: [0, 15, -10, 5, -5, 0],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.TADA]: {
      animate: {
        transform: [
          'scaleX(1)',
          'scale3d(.9,.9,.9) rotate(-3deg)',
          'scale3d(1.1,1.1,1.1) rotate(3deg)',
          'scale3d(1.1,1.1,1.1) rotate(-3deg)',
          'scaleX(1)',
        ],
        transition: { ease: ease ?? 'linear', delay, duration: resolvedDuration, repeat: repeatValue },
      },
    },

    [AnimationTypes.BOUNCE_IN]: {
      initial: { opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' },
      animate: {
        opacity: [0, 1, 1, 1, 1],
        transform: [
          'scale3d(0.3, 0.3, 0.3)',
          'scale3d(1.1, 1.1, 1.1)',
          'scale3d(0.9, 0.9, 0.9)',
          'scale3d(1.03, 1.03, 1.03)',
          'scale3d(0.97, 0.97, 0.97)',
          'scale3d(1, 1, 1)',
        ],
        transition: {
          ease: ease ?? 'easeInOut',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.BOUNCE_OUT]: {
      animate: {
        opacity: [1, 1, 0],
        transform: [
          'scale3d(0.9, 0.9, 0.9)',
          'scale3d(1.1, 1.1, 1.1)',
          'scale3d(1.1, 1.1, 1.1)',
          'scale3d(0.3, 0.3, 0.3)',
        ],
        transition: {
          ease: ease ?? 'easeInOut',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.FADE_IN]: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          ease: ease ?? 'anticipate',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
      exit: { opacity: 0 },
    },

    [AnimationTypes.FADE_OUT]: {
      initial: { opacity: 1 },
      animate: {
        opacity: 0,
        transition: {
          ease: ease ?? 'easeInOut',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.FLIP_IN_X]: {
      initial: {
        opacity: 0,
        transform: 'perspective(400px) rotateX(90deg)',
      },
      animate: {
        opacity: [0, 1, 1, 1],
        transform: [
          'perspective(400px) rotateX(90deg)',
          'perspective(400px) rotateX(-20deg)',
          'perspective(400px) rotateX(10deg)',
          'perspective(400px) rotateX(-5deg)',
          'perspective(400px)',
        ],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.FLIP_IN_Y]: {
      initial: {
        opacity: 0,
        transform: 'perspective(400px) rotateY(90deg)',
      },
      animate: {
        opacity: [0, 1, 1, 1],
        transform: [
          'perspective(400px) rotateY(90deg)',
          'perspective(400px) rotateY(-20deg)',
          'perspective(400px) rotateY(10deg)',
          'perspective(400px) rotateY(-5deg)',
          'perspective(400px)',
        ],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.LIGHT_SPEED_IN_LEFT]: {
      initial: {
        opacity: 0,
        transform: 'translate3d(-100%, 0, 0) skewX(30deg)',
      },
      animate: {
        opacity: [0, 1, 1, 1],
        transform: ['translate3d(-100%, 0, 0) skewX(30deg)', 'skewX(-20deg)', 'skewX(5deg)', 'translateZ(0)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.SLIDE_IN_UP]: {
      initial: {
        transform: 'translate3d(0, 100%, 0)',
        visibility: 'visible',
      },
      animate: {
        transform: ['translate3d(0, 100%, 0)', 'translateZ(0)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.SLIDE_IN_DOWN]: {
      initial: {
        transform: 'translate3d(0, -100%, 0)',
        visibility: 'visible',
      },
      animate: {
        transform: ['translate3d(0, -100%, 0)', 'translateZ(0)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.SLIDE_IN_LEFT]: {
      initial: {
        opacity: 0,
        transform: 'translate3d(-100%, 0, 0)',
        visibility: 'visible',
      },
      animate: {
        opacity: [0, 1],
        transform: ['translate3d(-100%, 0, 0)', 'translateZ(0)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.SLIDE_IN_RIGHT]: {
      initial: {
        transform: 'translate3d(100%, 0, 0)',
        visibility: 'visible',
        opacity: 0,
      },
      animate: {
        opacity: [0, 1],
        transform: ['translate3d(100%, 0, 0)', 'translateZ(0)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.ZOOM_IN]: {
      initial: {
        opacity: 0,
        transform: 'scale3d(0.3, 0.3, 0.3)',
      },
      animate: {
        opacity: [0, 1],
        transform: ['scale3d(0.3, 0.3, 0.3)', 'scale3d(1, 1, 1)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.ZOOM_IN_DOWN]: {
      initial: {
        opacity: 0,
        transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)',
      },
      animate: {
        opacity: [0, 1],
        transform: [
          'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)',
          'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
        ],
        transition: {
          ease: ease ?? [0.55, 0.055, 0.675, 0.19],
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },

    [AnimationTypes.ZOOM_OUT]: {
      initial: {
        opacity: 1,
      },
      animate: {
        opacity: [1, 0, 0],
        transform: ['scale3d(1, 1, 1)', 'scale3d(0.3, 0.3, 0.3)', 'scale3d(0.3, 0.3, 0.3)'],
        transition: {
          ease: ease ?? 'easeIn',
          delay,
          duration: resolvedDuration,
          repeat: repeatValue,
        },
      },
    },
  };

  return animations[type] || {};
};

export { AnimationTypes, getAnimation };
