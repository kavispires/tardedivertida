import { Avatar } from 'components/avatars';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';

export function VoteCruzaPalavras({ task, players, playersList }: VoteComponentProps) {
  const cheatSheet: PlainObject = {
    0: [task.data.cards[0].text, task.data.cards[2].text],
    1: [task.data.cards[0].text, task.data.cards[3].text],
    2: [task.data.cards[1].text, task.data.cards[2].text],
    3: [task.data.cards[1].text, task.data.cards[3].text],
  };

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div>{player.name}</div>
          <div key={player.data.value} className="task-result-values__text-value">
            {cheatSheet[player.data.value][0]} {'+'} {cheatSheet[player.data.value][1]}
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}