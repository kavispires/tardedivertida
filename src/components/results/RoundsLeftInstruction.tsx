// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';

type RoundsLeftInstructionProps = {
  /**
   * The state round object with current and total values
   */
  round: GameRound;
};

/**
 * Displays instructional sentence based on the number of rounds left for the game to end
 */
export function RoundsLeftInstruction({ round }: RoundsLeftInstructionProps) {
  const left = (round?.total ?? 0) - (round?.current ?? 0);

  if (left === 0 || round.forceLastRound) {
    return (
      <RuleInstruction type="event">
        <Translate
          pt="Essa foi a última rodada"
          en="No more rounds left"
        />
      </RuleInstruction>
    );
  }

  return (
    <RuleInstruction type="tip">
      <Translate
        en={
          left === 1
            ? '<strong>1 round</strong> left for the game to end...'
            : '<left>rounds</left> left for the game to end...'
        }
        pt={
          left === 1
            ? 'Falta <strong>1</strong> rodada para o jogo terminar...'
            : 'Faltam <left>rodadas</left> para o jogo terminar...'
        }
        values={{
          left: (value) => (
            <strong>
              {left} {value}
            </strong>
          ),
        }}
      />
    </RuleInstruction>
  );
}
