// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { WavelengthDeviceIcon } from 'icons/WavelengthDeviceIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { ONDA_TELEPATICA_PHASES } from './utils/constants';
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';

export function PhaseReveal({ state, players }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [psychic] = useWhichPlayerIsThe('psychicId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<WavelengthDeviceIcon />}
      title={
        <Translate
          pt="Resultado"
          en="Results"
        />
      }
      currentRound={state?.round?.current}
      duration={4}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Hora de contar os pontos!"
          en="Time to score!"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ONDA_TELEPATICA_PHASES.REVEAL}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepReveal
          players={players}
          psychic={psychic}
          currentCategory={state.currentCategory}
          goToNextStep={goToNextStep}
          announcement={announcement}
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
