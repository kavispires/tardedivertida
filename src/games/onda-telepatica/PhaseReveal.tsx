// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepReveal } from './StepReveal';
import { WavelengthDeviceIcon } from 'components/icons/WavelengthDeviceIcon';
import { StepRanking } from './StepRanking';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [psychic] = useWhichPlayerIsThe('psychicId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.REVEAL}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<WavelengthDeviceIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Hora de contar os pontos!" en="Time to score!" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          players={players}
          psychic={psychic}
          currentCategory={state.currentCategory}
          goToNextStep={goToNextStep}
        />

        {/* Step 2 */}
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

export default PhaseReveal;
