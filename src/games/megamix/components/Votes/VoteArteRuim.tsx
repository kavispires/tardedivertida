import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CanvasSVG } from 'components/canvas';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteArteRuim({ track, playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
  });

  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  if (track.variant === 'drawings') {
    return (
      <SpacePlayerCheckWrapper
        playersList={playersList}
        paths={['data.value']}
      >
        <div className="vote-groups">
          {Object.entries(groupedVotes).map(([playerId, voters]) => {
            const drawing = track.data.options.find((entry: PlainObject) => entry.playerId === playerId);
            return (
              <div
                key={`vote-group-${playerId}`}
                className="vote-groups__group"
              >
                <div className="vote-groups__target">
                  {Boolean(drawing) && (
                    <CanvasSVG
                      drawing={drawing.drawing}
                      width={width}
                      className="a-drawing"
                    />
                  )}
                </div>

                <Voters voters={voters} />
              </div>
            );
          })}
        </div>
      </SpacePlayerCheckWrapper>
    );
  }

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([cardId, voters]) => {
          const card = track.data.cards.find((entry: PlainObject) => entry.id === cardId);
          return (
            <div
              key={`vote-group-${cardId}`}
              className="vote-groups__group"
            >
              <div className="vote-groups__target">
                <div className="player-vote__value">{Boolean(card) && card.text}</div>
              </div>

              <Voters voters={voters} />
            </div>
          );
        })}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
