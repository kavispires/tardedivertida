import { isEqual } from 'lodash';
// Types
import type { PhaseProps } from 'types/game';
import type { GamePlayer } from 'types/player';
// Utils
import { AVATARS } from 'utils/avatars';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { Avatar } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import { achievementsReference } from './utils/achievements';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<CrownIcon />}>
      {!isEqual(state.winners, state.fairWinners) && (
        <Container
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
                  <li className="game-over__winner" key={`winner-${winner.name}`}>
                    <Avatar className="game-over__avatar" id={winner.avatarId ?? 25} />
                    <div className="game-over__winner-name">
                      <strong>{winner.name ?? '?'}</strong>,{' '}
                      <DualTranslate>{AVATARS[winner.avatarId].description}</DualTranslate>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Instruction>
        </Container>
      )}

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
    </GameOverWrapper>
  );
}
