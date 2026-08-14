// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { BookshelfIcon } from '@icons/BookshelfIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseResultState } from './utils/types';
import { SENSO_LITERARIO_PHASES } from './utils/constants';
import { StepRanking } from './StepRanking';
import { StepResults } from './StepResults';

export function PhaseResult({ players, state, user }: PhaseProps<PhaseResultState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<BookshelfIcon />}
      title={
        <Translate
          pt="Quem acertou?"
          en="Who got it right?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Não há resposta correta! Mas você tem o mesmo senso literário que outros jogadores?"
          en="There is no correct answer! But do you have the same literary sense as other players?"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SENSO_LITERARIO_PHASES.RESULT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepResults
          user={user}
          players={players}
          announcement={announcement}
          sequence={state.sequence}
          gallery={state.gallery}
          goToNextStep={goToNextStep}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goBack={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
