import { isEqual } from 'lodash';
// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { Avatar } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { CrownIcon } from 'components/icons/CrownIcon';
import { DualTranslate, Translate } from 'components/language';
import { Instruction, Title } from 'components/text';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<CrownIcon />}>
      {!isEqual(state.winners, state.fairWinners) && (
        <>
          <Title size="xx-small">
            <Translate
              pt="Se a vida fosse justa, quem teria ganhado, com mais pontos, seria:"
              en="If life was fair, the winner with the most points would've been:"
            />
          </Title>
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
        </>
      )}
    </GameOverWrapper>
  );
}
