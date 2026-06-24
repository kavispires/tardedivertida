// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { CreateIcon } from '@icons/CreateIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { PhaseCreatingConceptsState } from './utils/types';
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { useOnSubmitConceptsAPIRequest } from './utils/api-requests';
import { StepCreateConcepts } from './StepCreateConcepts';

export function PhaseCreatingConcepts({ state, players, user }: PhaseProps<PhaseCreatingConceptsState>) {
  const { step, goToNextStep, setStep } = useStep();
  const onSubmitConcepts = useOnSubmitConceptsAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={IDADE_DA_PREDA_PHASES.CREATING_CONCEPTS}
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
          time={5}
        >
          <Surface contained>{getAge(state?.round?.current)}</Surface>
        </RoundAnnouncement>

        <PhaseAnnouncement
          icon={<CreateIcon />}
          title={
            <Translate
              pt="Criação de Conceitos"
              en="ConceptData Creation"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
        >
          <Surface>
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
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepCreateConcepts
          user={user}
          players={players}
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

const getAge = (round: number) => {
  switch (round) {
    case 1: {
      return (
        <Translate
          pt="Idade da Pedra"
          en="Stone Age"
        />
      );
    }
    case 2: {
      return (
        <Translate
          pt="Idade Medieval"
          en="Medieval Age"
        />
      );
    }
    case 3: {
      return (
        <Translate
          pt="Idade Industrial"
          en="Industrial Age"
        />
      );
    }
    case 4: {
      return (
        <Translate
          pt="Idade Moderna"
          en="Modern Age"
        />
      );
    }
    case 5: {
      return (
        <Translate
          pt="O Futuro?"
          en="Future?"
        />
      );
    }
    default: {
      return (
        <Translate
          pt="Uma nova era se aproxima"
          en="A new era is coming"
        />
      );
    }
  }
};
