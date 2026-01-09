// Components
import { PlayerAvatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteCruzaPalavras({ track, playersList }: VoteComponentProps) {
  const cheatSheet: PlainObject = {
    0: [track.data.cards[0].text, track.data.cards[2].text],
    1: [track.data.cards[0].text, track.data.cards[3].text],
    2: [track.data.cards[1].text, track.data.cards[2].text],
    3: [track.data.cards[1].text, track.data.cards[3].text],
  };

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      {playersList.map((player) => (
        <div
          key={`vote-${player.id}`}
          className="player-vote"
        >
          <PlayerAvatar avatarId={player.avatarId} />
          <div>{player.name}</div>
          <div
            key={player.data.value}
            className="track-result-values__text-value"
          >
            {cheatSheet[player.data.value][0]} {'+'} {cheatSheet[player.data.value][1]}
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
