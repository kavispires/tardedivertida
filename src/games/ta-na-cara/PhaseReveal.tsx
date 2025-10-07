// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SpotlightIcon } from 'icons/SpotlightIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { TA_NA_CARA_PHASES } from './utils/constants';
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';
// Icons

export function PhaseReveal({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep();
  const [targetedPlayer] = useWhichPlayerIsThe('targetId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<SpotlightIcon />}
      title={<Translate pt="E a pessoa foi descoberta?" en="Was the person revealed?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate pt="Quem? O que? Esse?" en="Who? What? That?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepReveal
          announcement={announcement}
          players={players}
          user={user}
          turnOrder={state.turnOrder}
          charactersDict={state.charactersDict}
          charactersIds={state.charactersIds}
          questionsDict={state.questionsDict}
          activePlayerId={state.activePlayerId}
          targetedPlayer={targetedPlayer}
          points={state.points ?? 1}
          correct={state.correct}
          goToNextStep={goToNextStep}
          result={state.result}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
