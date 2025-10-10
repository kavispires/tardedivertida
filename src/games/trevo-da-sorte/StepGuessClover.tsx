// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { CloverObject, Leaves } from './utils/types';
import { mockGuesses } from './utils/mock';
import { useCloverState } from './utils/useCloverState';
import { Clover } from './components/Clover';
import { DetachedLeaves } from './components/DetachedLeaves';
import { GuessingRules } from './components/RulesBlobs';

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
      <StepTitle>
        <Translate
          pt={
            <>
              Adivinhação do trevo do(a) <PlayerAvatarName player={activeCloverPlayer} />
            </>
          }
          en={
            <>
              Guessing <PlayerAvatarName player={activeCloverPlayer} />
              's clover
            </>
          }
        />
      </StepTitle>

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

      <SpaceContainer align="center">
        <Button type="primary" size="large" onClick={submitClover} disabled={!isCloverComplete || isLoading}>
          <Translate pt="Enviar adivinhação" en="Submit guess" />
        </Button>

        <DevButton size="large" onClick={onSubmitMock}>
          Mock guesses
        </DevButton>
      </SpaceContainer>
    </Step>
  );
}
