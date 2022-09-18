import { Button, Space } from 'antd';

import { AvatarName } from 'components/avatars';

import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

import { useLoading } from 'hooks/useLoading';
import { Clover } from './components/Clover';
import { DetachedLeaves } from './components/DetachedLeaves';

import { mockGuesses } from './utils/mock';
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
    onLeafRotate,
    onRotateClover,
    guesses,
    onActivateLeaf,
    activeLeafId,
    onActivateSlot,
    activeSlotId,
    usedLeavesIds,
    onLeafRemove,
    isCloverComplete,
    submitClover,
    locks,
  } = useCloverState('guess', clover, leaves, onSubmitGuess);

  const onSubmitMock = () => {
    onSubmitGuess({
      guesses: mockGuesses(leaves),
      activeCloverId: clover.cloverId,
    });
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

      <Clover
        mode="guess"
        clover={clover}
        leaves={leaves}
        onRotate={onRotateClover}
        rotation={rotation}
        onLeafRotate={onLeafRotate}
        rotations={rotations}
        guesses={guesses}
        onLeafGrab={onActivateLeaf}
        activeLeafId={activeLeafId}
        onActivateSlot={onActivateSlot}
        activeSlotId={activeSlotId}
        onLeafRemove={onLeafRemove}
        locks={locks}
      />

      <DetachedLeaves
        leaves={leaves}
        rotations={rotations}
        onLeafRotate={onLeafRotate}
        onLeafGrab={onActivateLeaf}
        activeLeafId={activeLeafId}
        usedLeavesIds={usedLeavesIds}
      />

      <Space className="space-container" align="center">
        <Button type="primary" size="large" onClick={submitClover} disabled={!isCloverComplete || isLoading}>
          <Translate pt="Enviar adivinhação" en="Submit guess" />
        </Button>

        <DebugOnly devOnly>
          <Button size="large" onClick={onSubmitMock}>
            Mock guesses
          </Button>
        </DebugOnly>
      </Space>
    </Step>
  );
}
