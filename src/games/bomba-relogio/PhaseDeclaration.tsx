// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BuildingIcon } from 'icons/BuildingIcon';
import { WalkieTalkieIcon } from 'icons/WalkieTalkieIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseDeclarationState } from './utils/types';
import { BOMBA_RELOGIO_PHASES } from './utils/constants';
import { useOnSubmitDeclarationAPIRequest } from './utils/api-requests';
import { useActivePlayers } from './utils/useActivePlayers';
import { StepDeclaration } from './StepDeclaration';

export function PhaseDeclaration({ players, state, user }: PhaseProps<PhaseDeclarationState>) {
  const { step, goToNextStep, setStep } = useStep();

  const onDeclare = useOnSubmitDeclarationAPIRequest(setStep);
  const { currentInvestigator: nextInvestigator, isTheCurrentInvestigator: isTheNextInvestigator } =
    useActivePlayers(state.status, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<BuildingIcon />}
      title={
        <Translate
          pt="Declaração"
          en="Declaration"
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
      allowedPhase={BOMBA_RELOGIO_PHASES.DECLARATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={state?.round?.current === 1 ? 10 : 5}
          unskippable
        >
          <Instruction contained>
            <Translate
              pt={
                <>
                  Há uma bomba no prédio! E um terrorista entre nós! Precisamos cortar todos os{' '}
                  {state.dataCounts.wires} fios vermelhos!!!
                </>
              }
              en={
                <>
                  There's a bom in the building! And a terrorist among us! We need to cut all{' '}
                  {state.dataCounts.wires} red wires!!!
                </>
              }
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 0 */}
        <StepDeclaration
          user={user}
          players={players}
          announcement={announcement}
          dataCounts={state.dataCounts}
          nextInvestigator={nextInvestigator}
          isTheNextInvestigator={isTheNextInvestigator}
          onDeclare={onDeclare}
          status={state.status}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
