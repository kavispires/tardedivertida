// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CanvasSVG } from 'components/canvas';
import { PlayerAvatar } from 'components/player';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteRetratoFalado({ track, playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
  });

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      {playersList.map((player) => {
        const drawing = track.data.options.find((entry: PlainObject) => entry.playerId === player.data.value);
        return (
          <div
            key={`vote-${player.id}`}
            className="player-vote"
          >
            <PlayerAvatar avatarId={player.avatarId} />
            <div>{player.name}</div>
            {Boolean(drawing) && (
              <CanvasSVG
                drawing={drawing.drawing}
                width={width}
                className="a-drawing"
              />
            )}
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
