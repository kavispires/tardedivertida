// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { BuildingIcon } from 'icons/BuildingIcon';
import { TDIcon } from 'icons/TDIcon';
import { WalkieTalkieIcon } from 'icons/WalkieTalkieIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseDeclarationState, PhaseExaminationState } from './utils/types';
import { BOMBA_RELOGIO_PHASES } from './utils/constants';
import {
  useOnSubmitDeclarationAPIRequest,
  useOnSubmitTargetAPIRequest,
  useOnUpdateTargetPlayerAPIRequest,
} from './utils/api-requests';
import { useActiveInvestigator, useTargetedPlayer } from './utils/useActivePlayers';
import { StepDeclaration } from './StepDeclaration';
import { StepExamine } from './StepExamine';

export function PhaseExamination({ players, state, user }: PhaseProps<PhaseExaminationState>) {
  const { step, goToNextStep, setStep } = useStep();

  const onTarget = useOnSubmitTargetAPIRequest();
  const onUpdate = useOnUpdateTargetPlayerAPIRequest();
  const [currentInvestigator, isTheCurrentInvestigator] = useActiveInvestigator(state.status, players);
  const [targetPlayer, isTheTargetPlayer] = useTargetedPlayer(state.status, players);
  console.log({
    currentInvestigator,
    targetPlayer,
  });

  const isFirstInvestigation = Object.values(state.status.cut).length === 0;

  const announcement = (
    <PhaseAnnouncement
      icon={<BuildingIcon />}
      title={
        <Translate
          pt="Encontre os fios vermelhos!"
          en="Find the red wires!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <IconAvatar icon={<WalkieTalkieIcon />} />
        <Translate
          pt={<>"Todos em seus postos! O que você tem ai?"</>}
          en={<>"Everyone to your posts! What do you have there?"</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={BOMBA_RELOGIO_PHASES.EXAMINATION}
    >
      <StepSwitcher
        step={step}
        players={players}
        conditions={user.hand && user.role}
      >
        {/* Step 0 */}
        <StepExamine
          user={user}
          players={players}
          announcement={announcement}
          dataCount={state.dataCount}
          // nextInvestigator={nextInvestigator}
          // isTheNextInvestigator={isTheNextInvestigator}
          onUpdateTargetPlayerId={onUpdate}
          onTargetCard={onTarget}
          status={state.status}
          round={state.round}
          currentTargetPlayerId={state.currentTargetPlayerId}
          isTheCurrentInvestigator={isTheCurrentInvestigator}
          currentInvestigator={currentInvestigator}
        />
        <div>?</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}
