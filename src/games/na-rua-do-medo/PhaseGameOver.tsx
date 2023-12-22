import { orderBy } from 'lodash';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
// Utils
import { AVATARS } from 'utils/avatars';
import { achievementsReference } from './utils/achievements';
// Icons
import { PoopIcon } from 'icons/PoopIcon';
// Components
import { CandyCount } from './components/CandyCount';
import { PlayerStats } from './components/PlayerStats';
import { GameOverWrapper } from 'components/game-over';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { Achievements } from 'components/general/Achievements';
import { CostumeAvatar } from 'components/avatars/CostumeAvatar';

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
  const user = useUser(players, state);

  const winningPlayersIds = state.winners.map((player: GamePlayer) => player.id);
  const nonWinningPlayers = orderBy(
    Object.values(players).filter((player) => !winningPlayersIds.includes(player.id)),
    'score',
    'desc'
  );

  return (
    <GameOverWrapper
      info={info}
      state={state}
      players={players}
      announcementIcon={<PoopIcon />}
      announcementDuration={6}
      announcementContent={
        <Instruction>
          <Translate
            pt="O jogador que comeu mais doces, teve uma caganeira horrível, mas é o campeão é..."
            en="The player who ate candy the most, had a terrible diarrhea, but it's the winner is..."
          />
        </Instruction>
      }
    >
      <Instruction contained>
        <p>
          <Translate pt="com" en="with" />
        </p>
        <ul className="n-game-over-players">
          {state.winners.map((player: GamePlayer) => {
            return (
              <div className="n-game-over-player">
                <CostumeAvatar
                  key={`winner-${player.id}`}
                  avatarId={state.winners[0].avatarId}
                  id={player.costumeId}
                />
                <div>
                  <CandyCount candyCount={player.score} size="default" />
                </div>
              </div>
            );
          })}
        </ul>
      </Instruction>

      <ul
        className="n-game-over-players"
        style={{ gridTemplateColumns: `repeat(${GRID_REPEAT?.[Object.keys(players).length] ?? 5}, 1fr)` }}
      >
        {nonWinningPlayers.map((player) => (
          <li className="n-game-over-player" key={`game-over-player-${player.id}`}>
            <div className="n-game-over-player__name">
              <CostumeAvatar avatarId={player.avatarId} id={player.costumeId} />
              <br />
              <strong>{player.name}</strong>, {AVATARS[player.avatarId].description[language]}
            </div>
            <div className="n-game-over-player__candy">
              <CandyCount candyCount={player.score} size="small" />
            </div>
          </li>
        ))}
      </ul>

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <PlayerStats user={user} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
