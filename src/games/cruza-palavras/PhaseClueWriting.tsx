// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useUser } from 'hooks/useUser';
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useOnSubmitClueAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { StepClueWriting } from './StepClueWriting';
import { WritingCluesRule } from './components/RulesBlobs';
import { GridIcon } from 'components/icons/GridIcon';

function PhaseClueWriting({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);

  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);

  const onSubmitClue = useOnSubmitClueAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.CLUE_WRITING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<GridIcon />}
          title={translate('Escreva!', 'Write!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <WritingCluesRule playerCount={Object.keys(players).length} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepClueWriting user={user} grid={state.grid} onSubmitClue={onSubmitClue} players={players} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseClueWriting;
