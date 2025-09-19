import clsx from 'clsx';
import { orderBy, sample } from 'lodash';
import { motion } from 'motion/react';
import { useMemo } from 'react';
// Ant Design Resources
import { Badge } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';

type JoinedPlayersProps = {
  players: GamePlayers;
  orientation: 'horizontal' | 'vertical';
};

export function JoinedPlayers({ players, orientation }: JoinedPlayersProps) {
  const orderedPlayers = useMemo(
    () => orderBy(Object.values(players), ['updatedAt', 'name'], ['asc']),
    [players],
  );

  return (
    <div className={clsx('joined-players', orientation === 'horizontal' && 'joined-players--horizontal')}>
      {orderedPlayers.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: index * 0.25 }}
        >
          <motion.div
            layoutId={`player-${player.id}`}
            className="joined-players__player"
            animate={{
              y: [0, 5, 0], // Y-axis movement
              filter: [
                'drop-shadow(0px 10px 4px rgba(0, 0, 0, 0.1))',
                'drop-shadow(0px 20px 4px rgba(0, 0, 0, 0.05))',
                'drop-shadow(0px 10px 4px rgba(0, 0, 0, 0.1))',
              ],
              transition: {
                duration: sample([6, 6.2, 7, 7.5, 8]), // Total time for one cycle
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
          >
            <Badge dot={player?.ready} color="green">
              <Avatar id={player?.avatarId} size="large" />
            </Badge>
            <div className="joined-players__avatar-name">
              <Translate pt="Fulano" en="John Doe" custom={player?.name} />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
