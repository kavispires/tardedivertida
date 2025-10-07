// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { QueueIcon } from 'icons/QueueIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { FILEIRA_DE_FATOS_PHASES } from './utils/constants';
import { StepRanking } from './StepRanking';
import { StepReveal } from './StepReveal';

export function PhaseResults({ state, players }: PhaseProps) {
  const { step, goToPreviousStep, goToNextStep } = useStep();
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<QueueIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Quem será que acertou mais?" en="Who got the most right?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={FILEIRA_DE_FATOS_PHASES.RESULTS}>
      <StepSwitcher step={step} players={players}>
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
