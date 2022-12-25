import { Avatar } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';
import { useCardWidth } from 'hooks/useCardWidth';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';

export function VoteArteRuim({ task, players, playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 1, 9, 80, 200, 0, 'results-values');

  if (task.variant === 'drawings') {
    return (
      <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
        {playersList.map((player) => {
          const drawing = task.data.options.find(
            (entry: PlainObject) => entry.playerId === player.data.value
          );
          return (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div>{player.name}</div>
              {Boolean(drawing) && <CanvasSVG drawing={drawing.drawing} size={width} className="a-drawing" />}
            </div>
          );
        })}
      </SpacePlayerCheckWrapper>
    );
  }

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => {
        const card = task.data.cards.find((entry: PlainObject) => entry.id === player.data.value);
        return (
          <div key={`vote-${player.id}`} className="player-vote">
            <Avatar id={player.avatarId} />
            <div className="player-vote__name">{player.name}</div>
            <div className="player-vote__value">{Boolean(card) && card.text}</div>
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
