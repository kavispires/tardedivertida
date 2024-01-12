// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { CloverObject, Leaves } from './utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockGuesses } from './utils/mock';
import { useCloverState } from './utils/useCloverState';
// Components
import { AvatarName } from 'components/avatars';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Clover } from './components/Clover';
import { DetachedLeaves } from './components/DetachedLeaves';
import { GuessingRules } from './components/RulesBlobs';
import { PopoverRule } from 'components/rules';

type StepGuessCloverProps = {
  clover: CloverObject;
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

      <GuessingRules />

      <PopoverRule content={<GuessingRules />} />

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

        <DevButton size="large" onClick={onSubmitMock}>
          Mock guesses
        </DevButton>
      </Space>
    </Step>
  );
}
