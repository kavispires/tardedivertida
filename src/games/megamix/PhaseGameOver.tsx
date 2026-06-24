import { isEqual } from 'lodash';
// Types
import type { PhaseProps, GamePlayer } from 'types/game';
// Utils
import { AVATARS } from '@utils/avatars';
// Icons
import { CrownIcon } from '@icons/CrownIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { Instruction } from '@components/text/Instruction';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import { achievementsReference } from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<CrownIcon />}
    >
      {!isEqual(state.winners, state.fairWinners) && (
        <TitledContainer
          title={
            <Translate
              pt="Se a vida fosse justa, quem teria ganhado, com mais pontos, seria:"
              en="If life was fair, the winner with the most points would've been:"
            />
          }
        >
          <Instruction contained>
            <ul className="game-over__winners">
              {state.fairWinners.map((winner: GamePlayer) => {
                return (
                  <li
                    className="game-over__winner"
                    key={`winner-${winner.name}`}
                  >
                    <PlayerAvatar
                      className="game-over__avatar"
                      avatarId={winner.avatarId ?? 25}
                    />
                    <div className="game-over__winner-name">
                      <strong>{winner.name ?? '?'}</strong>,{' '}
                      <DualTranslate>{AVATARS[winner.avatarId].description}</DualTranslate>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Instruction>
        </TitledContainer>
      )}

      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
    </GameOverWrapper>
  );
}
