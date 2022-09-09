import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { CloverWait } from './components/CloverWait';
import { useCloverState } from './utils/useCloverState';

type StepWaitCloverProps = {
  activeCloverPlayer: GamePlayer;
  clover: Clover;
  leaves: Leaves;
};

export function StepWaitClover({ activeCloverPlayer, clover, leaves }: StepWaitCloverProps) {
  const { rotation, rotations, onRotateLeaf, onRotateClover, guesses, clues } = useCloverState(
    'wait',
    clover,
    leaves
  );

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate
          pt={
            <>
              Adivinhação do trevo do(a) <AvatarName player={activeCloverPlayer} />
            </>
          }
          en={
            <>
              Guessing <AvatarName player={activeCloverPlayer} />
              's clover
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Aguarde enquanto os outros jogadores tentam adivinhar.
              <br />
              Enquanto isso, veja as cartas que eles tem disponíveis.
            </>
          }
          en={
            <>
              Wait while other players are trying to guess your clover.
              <br /> In the meantime, check it out the cards they have available.
            </>
          }
        />
      </Instruction>

      <CloverWait
        leaves={leaves}
        clues={clues}
        onRotateClover={onRotateClover}
        rotation={rotation}
        onRotateLeaf={onRotateLeaf}
        rotations={rotations}
        guesses={guesses}
      />
    </Step>
  );
}
