// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DreamIcon } from 'icons/DreamIcon';
// Components
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitDreamAPIRequest } from './utils/api-requests';
import { DreamTellingRules } from './components/RulesBlobs';
import { StepTellDream } from './StepTellDream';

export function PhaseDreamTelling({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitDream = useOnSubmitDreamAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.DREAM_TELLING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} buttonText="" onPressButton={goToNextStep} time={5}>
          <Instruction contained>
            <Translate
              pt="Sabe quando você sonha com uma coisa, mas não consegue explicar? Então..."
              en="You know when you dream about something but you can't quite explain? So..."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<DreamIcon />}
          title={<Translate pt="Conte-nos sobre seu sonho" en="Tell us about your dream..." />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <DreamTellingRules />
          </Instruction>
          <ImageCardPreloadHand hand={state.table} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepTellDream players={players} table={state.table} onSubmitDream={onSubmitDream} user={user} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
