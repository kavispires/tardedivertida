// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { QueueIcon } from '@icons/QueueIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { FILEIRA_DE_FATOS_PHASES } from './utils/constants';
import type { PhaseResultsState } from './utils/types';
import { StepRanking } from './StepRanking';
import { StepReveal } from './StepReveal';

export function PhaseResults({ state, players }: PhaseProps<PhaseResultsState>) {
  const { step, goToPreviousStep, goToNextStep } = useStep();
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<QueueIcon />}
      title={
        <Translate
          pt="Resultado"
          en="Results"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Quem será que acertou mais?"
          en="Who got the most right?"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={FILEIRA_DE_FATOS_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepReveal
          scenarios={state.scenarios}
          players={players}
          activePlayer={activePlayer}
          announcement={announcement}
          goToNextStep={goToNextStep}
          roundType={state.roundType}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
          roundType={state.roundType}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
