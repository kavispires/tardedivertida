// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { pluralize } from 'utils/helpers';

type RoundsLeftInstructionProps = {
  /**
   * The state round object with current and total values
   */
  round: GameRound;
  /**
   * Flag indicating if it is the last round
   */
  lastRound?: boolean;
};

/**
 * Displays instructional sentence based on the number of rounds left for the game to end
 */
export function RoundsLeftInstruction({ round, lastRound }: RoundsLeftInstructionProps) {
  const left = (round?.total ?? 0) - (round?.current ?? 0);

  if (left === 0 || lastRound) {
    return (
      <Instruction contained>
        <Translate pt="Essa foi a última rodada" en="No more rounds left" />
      </Instruction>
    );
  }

  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            {pluralize(left, 'Falta', 'Faltam')} <strong>{left}</strong>{' '}
            {pluralize(left, 'rodada', 'rodadas')} para o jogo terminar...
          </>
        }
        en={
          <>
            <strong>{left}</strong> {pluralize(left, 'round', 'rounds')} left for the game to end...
          </>
        }
      />
    </Instruction>
  );
}
