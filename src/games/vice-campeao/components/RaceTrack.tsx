import { orderBy } from 'lodash';
import { motion, AnimatePresence } from 'motion/react';
// Ant Design Resources
import { Avatar, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Internal
import type { RunActivity } from '../utils/types';
import { RunnerAvatar } from './RunnerAvatar';

const TRACK_MIN = -10;
const TRACK_MAX = 20;
const POSITION_WIDTH = 40; // width per segment
const TRACK_HEIGHT = 40; // height per track line
const AVATAR_SIZE = 48;

type RaceTrackProps = {
  runActivity: RunActivity;
  players: GamePlayers;
};

export function RaceTrack({ players, runActivity }: RaceTrackProps) {
  const orderedPlayers = orderBy(Object.values(players), ['name'], ['asc']);
  const trackCount = orderedPlayers.length + 1;
  const runnerIds = orderedPlayers.map((player) => player.id);

  // Horizontal track lines
  const horizontalLines = Array.from({ length: trackCount }, (_, i) => (
    <div key={`track-${i}`} className="track-row" style={{ top: `${i * TRACK_HEIGHT}px` }} />
  ));

  // Vertical segments with labels
  const verticalSegments = [];
  for (let i = TRACK_MIN; i <= TRACK_MAX; i++) {
    verticalSegments.push(
      <div
        key={`segment-${i}`}
        className="track-segment"
        style={{ left: `${(i - TRACK_MIN) * POSITION_WIDTH}px` }}
      >
        <div className="segment-line" />
        <Avatar className="segment-label" shape="square">
          {i}
        </Avatar>
      </div>,
    );
  }

  return (
    <div className="race-track-container">
      <div
        className="race-track"
        style={{
          width: `${(TRACK_MAX - TRACK_MIN + 1) * POSITION_WIDTH}px`,
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
                  x: startPosition * POSITION_WIDTH,
                  y: yValue,
                }}
                animate={{
                  x: (endPosition - TRACK_MIN) * POSITION_WIDTH,
                  y: yValue,
                }}
                transition={{ duration: 1, delay: 1 }}
              >
                <Tooltip title={players[playerId].name} placement="right">
                  <RunnerAvatar avatarId={players[playerId].avatarId} width={AVATAR_SIZE} />
                </Tooltip>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
