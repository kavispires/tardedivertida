import { useMemo } from 'react';
// Ant Design Resources
import { Avatar as AntAvatar, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { ActingRole } from '../utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { SuspectCard } from 'components/cards/SuspectCard';

type ReleasedActorsProps = {
  actors: ActingRole['candidates'];
  selection: CardId[];
  players: GamePlayers;
  playersSelections: Record<CardId, PlayerId[]>;
};

export function ReleasedActors({ actors, players, selection, playersSelections }: ReleasedActorsProps) {
  const cardWidth = useCardWidth(6, { gap: 16, minWidth: 70, maxWidth: 120, margin: 16 });

  const nonSelectedActors = useMemo(() => {
    return Object.values(actors).filter((actor) => !selection.includes(actor.id));
  }, [actors, selection]);

  if (nonSelectedActors.length === 0) {
    return <></>;
  }

  return (
    <Space className="actors-board space-container" wrap>
      {nonSelectedActors.map((actor) => {
        return (
          <Space key={actor.id} className="actors-board__actor" direction="vertical">
            <Space className="space-container">
              <AntAvatar.Group maxCount={7}>
                {(playersSelections[actor.id] ?? []).map((playerId) => (
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
