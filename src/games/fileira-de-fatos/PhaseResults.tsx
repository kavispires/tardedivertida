// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { QueueIcon } from 'icons/QueueIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepRanking } from './StepRanking';
import { StepReveal } from './StepReveal';
import { Instruction } from 'components/text';

export function PhaseResults({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.FILEIRA_DE_FATOS.RESULTS}>
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
