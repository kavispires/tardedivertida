// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';

export function VoteRetratoFalado({ task, players, playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 1, 9, 80, 200, 0, 'results-values');

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => {
        const drawing = task.data.options.find((entry: PlainObject) => entry.playerId === player.data.value);
        return (
          <div key={`vote-${player.id}`} className="player-vote">
            <Avatar id={player.avatarId} />
            <div>{player.name}</div>
            {Boolean(drawing) && <CanvasSVG drawing={drawing.drawing} width={width} className="a-drawing" />}
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
