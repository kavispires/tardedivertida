// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitClueAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { GridIcon } from 'icons/GridIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { StepClueWriting } from './StepClueWriting';
import { WritingCluesRule } from './components/RulesBlobs';
import { Translate } from 'components/language';
import { PlayerRecentClue } from './components/PlayerRecentClue';

export function PhaseClueWriting({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const user = useUser(players, state);

  const onSubmitClue = useOnSubmitClueAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<GridIcon />}
      title={<Translate pt="Escreva!" en="Write!" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <WritingCluesRule playerCount={Object.keys(players).length} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.CLUE_WRITING}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <PlayerRecentClue grid={state.grid} user={user} /> }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <StepClueWriting
          user={user}
          grid={state.grid}
          onSubmitClue={onSubmitClue}
          players={players}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
