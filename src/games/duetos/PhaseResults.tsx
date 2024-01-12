// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { PuzzleIcon } from 'icons/PuzzleIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepResult } from './StepResults';
import { StepRanking } from './StepRanking';

export function PhaseResults({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<PuzzleIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>Quantos pares você acertou?</>} en={<>How many pairs did you get?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.DUETOS.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          players={players}
          announcement={announcement}
          goToNextStep={goToNextStep}
          gallery={state.gallery}
          leftOut={state.leftOut}
          pool={state.pool}
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
