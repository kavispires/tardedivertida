import type { MountainDilemma } from '../utils/types';
import { useCardWidth } from 'hooks/useCardWidth';
import mountainIcons from './mountain-icons.svg';
import clsx from 'clsx';
import { forwardRef, useEffect, useRef } from 'react';
import type { GamePlayer } from 'types/player';
import { IconAvatar } from 'components/avatars';
import { SkierIcon } from 'icons/SkierIcon';
import { getAvatarColorById } from 'utils/helpers';
import { motion, useAnimation, useAnimate } from 'framer-motion';
import { useMouseDirection } from 'hooks/useMouseDirection';

type MountainProps = {
  mountain: MountainDilemma[];
  skier: GamePlayer;
  animateFrom: number;
  animateTo: 'left' | 'right' | null;
  betType?: string;
  showLevel: number;
};

export function Mountain({ mountain, skier, animateFrom = 0, animateTo, betType, showLevel }: MountainProps) {
  const lodgeWidth = useCardWidth(6, { gap: 32, margin: 64, maxWidth: 175 });
  const mountainCardWidth = lodgeWidth * 2;
  const [refSkier, animate] = useAnimate();
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const controls = useAnimation();
  const initialRef = refs[animateFrom];

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (initialRef?.current) {
      const fromBox = initialRef.current.getBoundingClientRect();

      // If it is supposed to animate
      if (animateTo) {
        animate([
          [refSkier.current, { left: fromBox.x + lodgeWidth - 32, top: fromBox.y - 32 }, { duration: 0 }],
          [
            refSkier.current,
            {
              left: fromBox.x + lodgeWidth - 32 + (animateTo === 'left' ? -(lodgeWidth / 2) : lodgeWidth / 2),
              top: fromBox.y + fromBox.height - 64,
            },
            { delay: 4, duration: 3, ease: 'circIn' },
          ],
        ]);
        // Otherwise, just place the skier in the initial position
      } else {
        animate([
          [refSkier.current, { left: fromBox.x + lodgeWidth - 32, top: fromBox.y - 32 }, { duration: 0 }],
        ]);
      }
    }
  }, [initialRef?.current]);

  const skierDirection = useMouseDirection(refSkier, 'horizontal');

  return (
    <div className="ski-mountain">
      <motion.span ref={refSkier} className="ski-mountain__skier" animate={controls}>
        <IconAvatar
          size="large"
          icon={<SkierIcon color={getAvatarColorById(skier.avatarId)} />}
          className={clsx('ski-mountain__skier-icon', `ski-mountain__skier-icon--${skierDirection}`)}
        />
      </motion.span>
      <div className="ski-mountain__dilemmas">
        <span />
        <span />
        <MountainCard
          mountainEntry={mountain[0]}
          width={mountainCardWidth}
          ref={refs[0]}
          // TODO: it's not colorizing on the starting results
          showDirection={showLevel >= 0}
          animate={betType === 'initial'}
        />
        <span />
        <span />
        {/* second row */}
        <span />
        <MountainCard
          mountainEntry={mountain[1]}
          width={mountainCardWidth}
          ref={refs[1]}
          showDirection={showLevel > 0}
          animate={betType === 'boost'}
        />
        <MountainCard
          mountainEntry={mountain[2]}
          width={mountainCardWidth}
          ref={refs[2]}
          showDirection={showLevel > 0}
          animate={betType === 'boost'}
        />
        <span />
        {/* third row */}
        <MountainCard
          mountainEntry={mountain[3]}
          width={mountainCardWidth}
          ref={refs[3]}
          showDirection={showLevel > 1}
          animate={betType === 'final'}
        />
        <MountainCard
          mountainEntry={mountain[4]}
          width={mountainCardWidth}
          ref={refs[4]}
          showDirection={showLevel > 1}
          animate={betType === 'final'}
        />
        <MountainCard
          mountainEntry={mountain[5]}
          width={mountainCardWidth}
          ref={refs[5]}
          showDirection={showLevel > 1}
          animate={betType === 'final'}
        />
      </div>
    </div>
  );
}

type MountainCardProps = {
  mountainEntry: MountainDilemma;
  width: number;
  showDirection: boolean;
  animate: boolean;
};

const getInitialColor = (showDirection: boolean, selected: boolean, animate: boolean) => {
  if (!showDirection || animate) return '#ffffff';

  return selected ? '#98b9fe' : '#ffffff';
};

const getEndColor = (showDirection: boolean, selected: boolean) => {
  if (!showDirection) return '#ffffff';
  return selected ? '#98b9fe' : '#ffffff';
};

const MountainCard = forwardRef<HTMLDivElement, MountainCardProps>(
  ({ mountainEntry, width, showDirection, animate }, ref) => {
    const initialBackground = getInitialColor(showDirection, mountainEntry.selected, animate);
    const endBackground = getEndColor(showDirection, mountainEntry.selected);

    return (
      <div ref={ref} className="ski-mountain-entry" style={{ width }}>
        <div className="ski-mountain-entry__prompt">{mountainEntry.dilemma.prompt}</div>
        <MountainIllustration spriteId={mountainEntry.spriteId} width={width / 2} />
        <div className="ski-mountain-entry__options">
          <motion.div
            className="ski-mountain-entry__option"
            initial={{ backgroundColor: mountainEntry.direction === 'left' ? initialBackground : '#ffffff' }}
            animate={{
              backgroundColor: mountainEntry.direction === 'left' ? endBackground : '#ffffff',
            }}
            transition={{ duration: 3, delay: 6 }}
          >
            {mountainEntry.dilemma.left}
          </motion.div>
          <motion.div
            className="ski-mountain-entry__option"
            initial={{ backgroundColor: mountainEntry.direction === 'right' ? initialBackground : '#ffffff' }}
            animate={{
              backgroundColor: mountainEntry.direction === 'right' ? endBackground : '#ffffff',
            }}
            transition={{ duration: 3, delay: 6 }}
          >
            {mountainEntry.dilemma.right}
          </motion.div>
        </div>
      </div>
    );
  },
);

type MountainIllustrationProps = {
  spriteId: string;
  width: number;
};

export function MountainIllustration({ spriteId, width }: MountainIllustrationProps) {
  return (
    <div className="ski-mountain-entry__illustration">
      <svg viewBox="0 0 512 512" className="ski-mountain-entry__icon">
        <use href={`${mountainIcons}#${spriteId}`}></use>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 285.5 104.2"
        className="ski-mountain-entry__path"
        style={{ width }}
      >
        <path
          fill="none"
          stroke="#bfd8ea"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
          d="M142.7 2.3s-.3 2-1.4 5.6"
        ></path>
        <path
          fill="none"
          stroke="#bfd8ea"
          strokeDasharray="0 0 11.26 11.26"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
          d="M137 18.3C126.2 39.8 96.1 77.8 13.4 99.2"
        ></path>
        <path
          fill="none"
          stroke="#bfd8ea"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
          d="m8 100.6-5.7 1.3M142.7 2.3s.3 2 1.5 5.6"
        ></path>
        <path
          fill="none"
          stroke="#bfd8ea"
          strokeDasharray="0 0 11.26 11.26"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
          d="M148.5 18.3c10.7 21.5 40.9 59.5 123.6 80.9"
        ></path>
      </svg>
    </div>
  );
}
