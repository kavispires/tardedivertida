import { Button, Space } from 'antd';
import clsx from 'clsx';
import { AvatarName } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { Clover } from './components/Clover';
import { Leaf } from './components/Leaf';
import { mockClues, mockSelectCards } from './utils/mock';
import { useCloverState } from './utils/useCloverState';

type StepGuessCloverProps = {
  clover: Clover;
  leaves: Leaves;
  onSubmitGuess: GenericFunction;
  controller: GamePlayer;
  isUserTheController: boolean;
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

    clues,
    guesses,
    allowLeafRotation,
    isCluesComplete,
  } = useCloverState('guess', clover, leaves);

  console.log({ clover });
  console.log({ leaves });

  const onSubmit = () => {
    onSubmitGuess({ clues });
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
      <Space className="space-container" align="center">
        <Clover
          leaves={leaves}
          clues={clues}
          rotation={rotation}
          guesses={guesses}
          allowLeafRotation={allowLeafRotation}
          onRotateClover={onRotateClover}
        />
        <Instruction contained>
          <Space className="space-container" align="center" wrap>
            {Object.values(leaves).map((leaf) => {
              return (
                <div className="y-leaf-loose">
                  <Leaf leaf={leaf} allowLeafRotation={true} />
                </div>
              );
            })}
          </Space>
        </Instruction>
      </Space>

      <Space className="space-container" align="center">
        <Button type="primary" size="large" onClick={onSubmit} disabled={!isCluesComplete || isLoading}>
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
