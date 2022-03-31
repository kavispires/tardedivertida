// Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitDreamAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  ImageCardPreloadHand,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
} from 'components';
import { StepTellDream } from './StepTellDream';
import { DreamTellingRules } from './RulesBlobs';

function PhaseDreamTelling({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const onSubmitDream = useOnSubmitDreamAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.DREAM_TELLING}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
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
          type="dream"
          title={translate('Conte-nos sobre seu sonho', 'Tell us about your dream...')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

export default PhaseDreamTelling;
