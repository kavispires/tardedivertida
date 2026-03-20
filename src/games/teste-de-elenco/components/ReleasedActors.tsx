import { useMemo } from 'react';
// Ant Design Resources
import { Avatar, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { SuspectCard } from 'components/cards/SuspectCard';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayerAvatar } from 'components/player';
// Internal
import type { ActingRole } from '../utils/types';

type ReleasedActorsProps = {
  actors: ActingRole['candidates'];
  selection: UID[];
  players: GamePlayers;
  playersSelections: Record<UID, UID[]>;
};

export function ReleasedActors({ actors, players, selection, playersSelections }: ReleasedActorsProps) {
  const cardWidth = useCardWidth(6, { gap: 16, minWidth: 70, maxWidth: 120, margin: 16 });

  const nonSelectedActors = useMemo(() => {
    return Object.values(actors).filter((actor) => !selection.includes(actor.id));
  }, [actors, selection]);

  if (nonSelectedActors.length === 0) {
    return null;
  }

  return (
    <SpaceContainer
      className="actors-board"
      wrap
    >
      {nonSelectedActors.map((actor) => {
        return (
          <Space
            key={actor.id}
            className="actors-board__actor"
            orientation="vertical"
          >
            <SuspectCard
              suspect={actor}
              width={cardWidth}
            />
            <SpaceContainer>
              <Avatar.Group max={{ count: 5 }}>
                {(playersSelections[actor.id] ?? []).map((playerId) => (
                  <PlayerAvatar
                    avatarId={players[playerId].avatarId}
                    key={`actor-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </Avatar.Group>
            </SpaceContainer>
          </Space>
        );
      })}
    </SpaceContainer>
  );
}
