import { orderBy } from 'lodash';
// Hooks
import { useLanguage, useUser } from 'hooks';
// Utils
import { AVATARS } from 'utils/constants';
// Components
import { Avatar, GameOverWrapper, Instruction, Translate } from 'components';
import { CandyCount } from './CandyCount';
import { PlayerStats } from './PlayerStats';

const GRID_REPEAT: NumberDictionary = {
  3: 3,
  4: 4,
  5: 5,
  6: 3,
  7: 4,
  8: 4,
  9: 5,
  10: 5,
};

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const { language } = useLanguage();
  const user = useUser(players);

  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon="poop"
      announcementDuration={6}
      announcementContent={
        <Instruction>
          <Translate
            pt="O jogador que comeu mais doces, teve uma caganeira horrível, mas é o campeão é..."
            en="The player who ate candy the most, had a terrible diarrhea, but it's the winner is..."
          />
        </Instruction>
      }
      showRateWidgetAfterContent
    >
      <Instruction>
        <Translate pt="com" en="with" />
        <CandyCount candyCount={state.winners[0].score} size="default" />
      </Instruction>

      <ul
        className="n-game-over-players"
        style={{ gridTemplateColumns: `repeat(${GRID_REPEAT?.[Object.keys(players).length] ?? 5}, 1fr)` }}
      >
        {orderBy(Object.values(players), 'score', 'desc').map((player) => (
          <li className="n-game-over-player" key={`game-over-player-${player.id}`}>
            <Avatar className="n-game-over-player__avatar" id={player.avatarId} />
            <div className="n-game-over-player__name">
              <strong>{player.name}</strong>, {AVATARS[player.avatarId].description[language]}
            </div>
            <div className="n-game-over-player__candy">
              <CandyCount candyCount={player.score} size="small" />
            </div>
          </li>
        ))}
      </ul>

      <PlayerStats user={user} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
