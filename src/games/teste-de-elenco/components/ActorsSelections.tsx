import { Avatar as AntAvatar, Space } from 'antd';
import { Avatar } from 'components/avatars';
import { SuspectCard } from 'components/cards/SuspectCard';

import { useCardWidth } from 'hooks/useCardWidth';
import { useMemo } from 'react';

type ActorsSelectionsProps = {
  actors: ActingRole['candidates'];
  selection: CardId[];
  players: GamePlayers;
};

export function ActorsSelections({ actors, players, selection }: ActorsSelectionsProps) {
  const cardWidth = useCardWidth(4, { gap: 16, minWidth: 80, maxWidth: 150, margin: 16 });

  const playersSelections = useMemo(() => {
    return Object.values(players).reduce((acc: Record<CardId, PlayerId[]>, player) => {
      if (acc[player.actorId] === undefined) {
        acc[player.actorId] = [];
      }
      acc[player.actorId].push(player.id);
      return acc;
    }, {});
  }, [players]);

  return (
    <Space className="actors-board space-container" wrap>
      {selection.map((actorId) => {
        const actor = actors[actorId];

        return (
          <Space key={actor.id} className="actors-board__actor" direction="vertical">
            <Space className="space-container">
              <AntAvatar.Group maxCount={7}>
                {playersSelections[actorId].map((playerId) => (
                  <Avatar
                    id={players[playerId].avatarId}
                    key={`actor-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
            </Space>

            <SuspectCard suspect={actor} width={cardWidth} />
          </Space>
        );
      })}
    </Space>
  );
}
