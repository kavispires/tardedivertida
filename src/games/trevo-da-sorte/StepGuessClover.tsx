import { Button, Space } from 'antd';

import { AvatarName } from 'components/avatars';

import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

import { useLoading } from 'hooks/useLoading';

import { DndClover } from './components/DndClover';

import { mockClues } from './utils/mock';
import { useCloverState } from './utils/useCloverState';

type StepGuessCloverProps = {
  clover: Clover;
  leaves: Leaves;
  onSubmitGuess: GenericFunction;
  onUpdateCloverState: GenericFunction;
  controller: GamePlayer;
  isUserTheController: boolean;
  activeCloverPlayer: GamePlayer;
  isUserTheCloverPlayer: boolean;
};

export function StepGuessClover({
  clover,
  leaves,
  onSubmitGuess,
  activeCloverPlayer,
  onUpdateCloverState,
}: StepGuessCloverProps) {
  const { isLoading } = useLoading();
  const { rotation, onRotateClover, clues, guesses, allowLeafRotation, mode } = useCloverState(
    'guess',
    clover,
    leaves
  );

  console.log({ clover });
  console.log({ leaves });

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

      <DndClover
        mode={mode}
        leaves={leaves}
        clues={clues}
        rotation={rotation}
        guesses={guesses}
        allowLeafRotation={allowLeafRotation}
        onRotateClover={onRotateClover}
        clover={clover}
        onSubmitGuess={function (...args: any): void {
          throw new Error('Function not implemented.');
        }}
        onUpdateCloverState={onUpdateCloverState}
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
