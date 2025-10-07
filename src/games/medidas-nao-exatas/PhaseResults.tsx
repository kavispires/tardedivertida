// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { QualitySealIcon } from 'icons/QualitySealIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { MEDIDAS_NAO_EXATAS_PHASES } from './utils/constants';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
// Icons

export function PhaseResults({ state, players }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep();
  const [presenter] = useWhichPlayerIsThe('presenterId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<QualitySealIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate pt={<>Quantos pontos você ganhou?</>} en={<>How many points did you get?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={MEDIDAS_NAO_EXATAS_PHASES.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResults
          players={players}
          announcement={announcement}
          goToNextStep={goToNextStep}
          presenter={presenter}
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
