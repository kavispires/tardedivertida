// Ant Design Resources
import { Avatar } from 'antd';
// Types
import type { PhaseProps, GameRound } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DJIcon } from 'icons/DJIcon';
// Components
import { DJPruPruPruSound } from 'components/audio/DJPruPruPruSound';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitTrackAnswerAPIRequest } from './utils/api-requests';
import { useColorizeBackground } from './utils/useColorizeBackground';
import { showDJPruPruPruStep } from './utils/helpers';
import { TrackIcon } from './components/TrackIcon';
import { TrackInstructions } from './components/TrackInstructions';
import { TrackTitle } from './components/TrackTitle';
import { DJInstructions } from './components/RulesBlobs';
import { StepTrack } from './StepTrack';

export function PhaseTrack({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep(showDJPruPruPruStep(state.round));

  // Dynamic background
  useColorizeBackground(user, state?.round?.current);

  const onSubmitAnswer = useOnSubmitTrackAnswerAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<TrackIcon track={state.track} />}
      title={
        <>
          <Avatar size="large" style={{ backgroundColor: 'DimGray', verticalAlign: 'middle' }}>
            {state.round.current}
          </Avatar>{' '}
          <TrackTitle track={state.track} />
        </>
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <TrackInstructions track={state.track} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.MEGAMIX.TRACK}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DJIcon />}
          title={<DJAnnouncementTitle round={state.round} />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 2 ? 20 : 7}
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

function DJAnnouncementTitle({ round }: { round: GameRound }) {
  if (round.current < 2) return <Translate pt="A Balada" en="The Club" />;
  if (round.current === Math.round(round.total / 2))
    return <Translate pt="E tamo só esquentando" en="We're halfway!" />;
  return <Translate pt="Última música" en="The last song" />;
}
