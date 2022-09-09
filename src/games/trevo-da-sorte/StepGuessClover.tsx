import { Button, Space } from 'antd';

import { AvatarName } from 'components/avatars';

import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

import { useLoading } from 'hooks/useLoading';
import { CloverGuess } from './components/CloverGuess';

import { mockClues } from './utils/mock';
import { useCloverState } from './utils/useCloverState';

type StepGuessCloverProps = {
  clover: Clover;
  leaves: Leaves;
  onSubmitGuess: GenericFunction;

  activeCloverPlayer: GamePlayer;
  isUserTheCloverPlayer: boolean;
};

export function StepGuessClover({ clover, leaves, onSubmitGuess, activeCloverPlayer }: StepGuessCloverProps) {
  const { isLoading } = useLoading();
  const {
    rotation,
    rotations,
    onRotateLeaf,
    onRotateClover,
    guesses,
    clues,
    onActivateLeaf,
    activeLeafId,
    onActivateSlot,
    activeSlotId,
  } = useCloverState('guess', clover, leaves);

  const onSubmit = () => {
    // onSubmitGuess({ clues });
  };
  const onSubmitMock = () => {
    onSubmitGuess(mockClues());
  };

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
        <Translate pt={<>??</>} en={<>??</>} />
      </Instruction>

      <CloverGuess
        leaves={leaves}
        clues={clues}
        onRotateClover={onRotateClover}
        rotation={rotation}
        onRotateLeaf={onRotateLeaf}
        rotations={rotations}
        guesses={guesses}
        onActivateLeaf={onActivateLeaf}
        activeLeafId={activeLeafId}
        onActivateSlot={onActivateSlot}
        activeSlotId={activeSlotId}
      />

      <Space className="space-container" align="center">
        <Button type="primary" size="large" onClick={onSubmit} disabled={isLoading}>
          <Translate pt="Enviar adivinhação" en="Submit guess" />
        </Button>

        <DebugOnly devOnly>
          <Button size="large" onClick={onSubmitMock} disabled>
            Mock clues
          </Button>
        </DebugOnly>
      </Space>
    </Step>
  );
}
