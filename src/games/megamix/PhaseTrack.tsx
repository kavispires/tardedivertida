// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitTrackAnswerAPIRequest } from './utils/api-requests';
import { useColorizeBackground } from './utils/useColorizeBackground';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { showDJPruPruPruStep } from './utils/helpers';
// Icons
import { DJIcon } from 'icons/DJIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TrackIcon } from './components/TrackIcon';
import { TrackInstructions } from './components/TrackInstructions';
import { StepTrack } from './StepTrack';
import { TrackTitle } from './components/TrackTitle';
import { DJInstructions } from './components/RulesBlobs';
import { Translate } from 'components/language';
import { DJPruPruPruSound } from 'components/audio/DJPruPruPruSound';

function PhaseTrack({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep(showDJPruPruPruStep(state.round));

  // Dynamic background
  useColorizeBackground(user, state?.round?.current);

  const onSubmitAnswer = useOnSubmitTrackAnswerAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<TrackIcon track={state.track} />}
      title={<TrackTitle track={state.track} />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <TrackInstructions track={state.track} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MEGAMIX.TRACK}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DJIcon />}
          title={<DJAnnouncementTitle round={state.round} />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 2 ? 5 : 7} // TODO: 20 instead of 5
          unskippable
          type="block"
        >
          <DJPruPruPruSound />
          <DJInstructions round={state.round} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepTrack
          track={state.track}
          round={state.round}
          players={players}
          announcement={announcement}
          onSubmitAnswer={onSubmitAnswer}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTrack;

function DJAnnouncementTitle({ round }: { round: GameRound }) {
  if (round.current < 2) return <Translate pt="A Balada" en="The Club" />;
  if (round.current === Math.round(round.total / 2))
    return <Translate pt="E tamo só esquentando" en="We're halfway!" />;
  return <Translate pt="Última música" en="The last song" />;
}
