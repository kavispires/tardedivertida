// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CanvasSVG } from 'components/canvas/CanvasSVG';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteRetratoFalado({ track, playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
  });

  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([playerId, voters]) => {
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
