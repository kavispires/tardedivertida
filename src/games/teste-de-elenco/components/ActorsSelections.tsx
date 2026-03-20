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

type ActorsSelectionsProps = {
  actors: ActingRole['candidates'];
  selection: UID[];
  players: GamePlayers;
  playersSelections: Record<UID, UID[]>;
};

export function ActorsSelections({ actors, players, selection, playersSelections }: ActorsSelectionsProps) {
  const cardWidth = useCardWidth(4, { gap: 16, minWidth: 80, maxWidth: 150, margin: 16 });

  return (
    <SpaceContainer
      className="actors-board"
      wrap
    >
      {selection.map((actorId) => {
        const actor = actors[actorId];

        return (
          <Space
            key={actor.id}
            className="actors-board__actor"
            orientation="vertical"
          >
            <SpaceContainer>
              <Avatar.Group max={{ count: 7 }}>
                {playersSelections[actorId].map((playerId) => (
                  <PlayerAvatar
                    avatarId={players[playerId].avatarId}
                    key={`actor-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </Avatar.Group>
            </SpaceContainer>

            <SuspectCard
              suspect={actor}
              width={cardWidth}
            />
          </Space>
        );
      })}
    </SpaceContainer>
  );
}
