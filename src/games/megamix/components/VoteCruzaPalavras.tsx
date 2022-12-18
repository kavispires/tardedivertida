import { Space } from 'antd';
import { Avatar } from 'components/avatars';

export function VoteCruzaPalavras({ task, winningValues, players }: ResultComponentProps) {
  const playersList = Object.values(players);

  const cheatSheet: PlainObject = {
    0: [task.data.cards[0].text, task.data.cards[2].text],
    1: [task.data.cards[0].text, task.data.cards[3].text],
    2: [task.data.cards[1].text, task.data.cards[2].text],
    3: [task.data.cards[1].text, task.data.cards[3].text],
  };

  return (
    <Space className="space-container" align="center" wrap>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div>{player.name}</div>
          <div key={player.data.value} className="task-result-values__text-value">
            {cheatSheet[player.data.value][0]} {'+'} {cheatSheet[player.data.value][1]}
          </div>
        </div>
      ))}
    </Space>
  );
}
