// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

type RoundsLeftInstructionProps = {
  round: GameRound;
};

export function RoundsLeftInstruction({ round }: RoundsLeftInstructionProps) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Faltam <strong>{(round?.total ?? 0) - (round?.current ?? 0)}</strong> rodadas para o jogo
            terminar...
          </>
        }
        en={
          <>
            <strong>{(round?.total ?? 0) - (round?.current ?? 0)}</strong> rounds left for the game to end...
          </>
        }
      />
    </Instruction>
  );
}
