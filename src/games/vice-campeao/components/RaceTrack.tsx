import { orderBy } from 'lodash';
import { motion, AnimatePresence } from 'motion/react';
import { useRef } from 'react';
// Ant Design Resources
import { Avatar, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Internal
import type { RunActivity } from '../utils/types';
import { RunnerAvatar } from './RunnerAvatar';

const TRACK_MIN = -10;
const TRACK_MAX = 20;
const POSITION_WIDTH = 40; // width per segment
const TRACK_HEIGHT = 40; // height per track line
const AVATAR_SIZE = 48;
const BUFFER = 3; // Show 3 extra positions on each side
const MIN_TRACK_WIDTH = 18; // Minimum number of positions to show

type RaceTrackProps = {
  runActivity: RunActivity;
  players: GamePlayers;
};

export function RaceTrack({ players, runActivity }: RaceTrackProps) {
  const orderedPlayers = orderBy(Object.values(players), ['name'], ['asc']);
  const trackCount = orderedPlayers.length + 1;
  const runnerIds = orderedPlayers.map((player) => player.id);

  // Stable track bounds - only update when necessary
  const trackBounds = useRef({ min: TRACK_MIN, max: TRACK_MIN + MIN_TRACK_WIDTH - 1 });

  // Calculate required bounds based on actual positions
  const allPositions = [
    ...Object.values(runActivity.startingPositions),
    ...Object.values(runActivity.endingPositions),
  ];

  const requiredMin = Math.max(TRACK_MIN, Math.min(...allPositions) - BUFFER);
  const requiredMax = Math.min(TRACK_MAX, Math.max(...allPositions) + BUFFER);

  // Only update bounds if runners would go outside current visible range
  let dynamicMin = trackBounds.current.min;
  let dynamicMax = trackBounds.current.max;

  if (requiredMin < dynamicMin || requiredMax > dynamicMax) {
    // Need to expand track bounds
    dynamicMin = Math.max(TRACK_MIN, requiredMin);
    dynamicMax = Math.min(TRACK_MAX, requiredMax);

    // Ensure minimum track width
    const currentWidth = dynamicMax - dynamicMin + 1;
    if (currentWidth < MIN_TRACK_WIDTH) {
      const expansion = Math.floor((MIN_TRACK_WIDTH - currentWidth) / 2);
      dynamicMin = Math.max(TRACK_MIN, dynamicMin - expansion);
      dynamicMax = Math.min(TRACK_MAX, dynamicMax + expansion);

      // If still too narrow due to bounds, expand the other side
      const adjustedWidth = dynamicMax - dynamicMin + 1;
      if (adjustedWidth < MIN_TRACK_WIDTH) {
        if (dynamicMin === TRACK_MIN) {
          dynamicMax = Math.min(TRACK_MAX, dynamicMin + MIN_TRACK_WIDTH - 1);
        } else {
          dynamicMin = Math.max(TRACK_MIN, dynamicMax - MIN_TRACK_WIDTH + 1);
        }
      }
    }

    // Update stable bounds
    trackBounds.current = { min: dynamicMin, max: dynamicMax };
  }

  // Horizontal track lines
  const horizontalLines = Array.from({ length: trackCount }, (_, i) => (
    <div
      key={`track-${i}`}
      className="track-row"
      style={{ top: `${i * TRACK_HEIGHT}px` }}
    />
  ));

  // Vertical segments with labels
  const verticalSegments = [];
  for (let i = dynamicMin; i <= dynamicMax; i++) {
    verticalSegments.push(
      <div
        key={`segment-${i}`}
        className="track-segment"
        style={{ left: `${(i - dynamicMin) * POSITION_WIDTH}px` }}
      >
        <div className="segment-line" />
        <Avatar
          className="segment-label"
          shape="square"
        >
          {i}
        </Avatar>
      </div>,
    );
  }

  return (
    <div className="race-track-container">
      <motion.div
        className="race-track"
        initial={{
          width: `${(dynamicMax - dynamicMin + 1) * POSITION_WIDTH}px`,
        }}
        animate={{
          width: `${(dynamicMax - dynamicMin + 1) * POSITION_WIDTH}px`,
        }}
        transition={{ duration: 0.8, delay: 1.2, ease: 'easeInOut' }}
        style={{
          height: `${trackCount * TRACK_HEIGHT}px`,
        }}
      >
        {verticalSegments}
        {horizontalLines}
        <AnimatePresence>
          {runnerIds.map((playerId, index) => {
            const startPosition = runActivity.startingPositions[playerId];
            const endPosition = runActivity.endingPositions[playerId];

            const yValue = ((index % trackCount) + TRACK_HEIGHT) * index - TRACK_HEIGHT;

            return (
              <motion.div
                key={playerId}
                className="runner"
                initial={{
                  x: (startPosition - dynamicMin) * POSITION_WIDTH,
                  y: yValue,
                }}
                animate={{
                  x: (endPosition - dynamicMin) * POSITION_WIDTH,
                  y: yValue,
                }}
                transition={{ duration: 1, delay: 1 }}
              >
                <Tooltip
                  title={players[playerId].name}
                  placement="right"
                >
                  <RunnerAvatar
                    avatarId={players[playerId].avatarId}
                    width={AVATAR_SIZE}
                  />
                </Tooltip>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
