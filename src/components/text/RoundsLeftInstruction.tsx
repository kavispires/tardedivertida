// Components
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
import { pluralize } from 'utils/helpers';

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
        <Translate pt="Essa foi a última rodada" en="No more rounds left" />
      </RuleInstruction>
    );
  }

  return (
    <RuleInstruction type="tip">
      <Translate
        pt={
          <>
            {pluralize(left, 'Falta', 'Faltam')} <strong>{left}</strong> {pluralize(left, 'rodada')} para o
            jogo terminar...
          </>
        }
        en={
          <>
            <strong>{left}</strong> {pluralize(left, 'round')} left for the game to end...
          </>
        }
      />
    </RuleInstruction>
  );
}
