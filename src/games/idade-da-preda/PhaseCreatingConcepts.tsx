// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { CreateIcon } from 'icons/CreateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
// Internal
import type { PhaseCreatingConceptsState } from './utils/types';
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { useOnSubmitConceptsAPIRequest } from './utils/api-requests';
import { StepCreateConcepts } from './StepCreateConcepts';

export function PhaseCreatingConcepts({ players, state }: PhaseProps<PhaseCreatingConceptsState>) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep();
  const onSubmitConcepts = useOnSubmitConceptsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<CreateIcon />}
      title={<Translate pt="Criação de Conceitos" en="Concept Creation" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Crie até <TextHighlight>{state.maxProposals}</TextHighlight> novos conceitos
            </>
          }
          en={
            <>
              Create up to <TextHighlight>{state.maxProposals}</TextHighlight> new concepts
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={IDADE_DA_PREDA_PHASES.CREATING_CONCEPTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5}>
          <Instruction contained>
            <Translate pt="Era" en="Age" /> {state?.round?.current}
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <StepCreateConcepts
          user={user}
          players={players}
          announcement={announcement}
          basicConcepts={state.basicConcepts}
          concepts={state.concepts}
          maxProposals={state.maxProposals}
          round={state.round}
          items={state.items}
          onSubmitConcepts={onSubmitConcepts}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
