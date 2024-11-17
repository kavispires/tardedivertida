// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { GridIcon } from 'icons/GridIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitClueAPIRequest } from './utils/api-requests';
import { WritingCluesRule } from './components/RulesBlobs';
import { PlayerRecentClue } from './components/PlayerRecentClue';
import { StepClueWriting } from './StepClueWriting';

export function PhaseClueWriting({ players, state }: PhaseProps) {
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
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.CLUE_WRITING}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <PlayerRecentClue grid={state.grid} user={user} /> }}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <StepClueWriting
          user={user}
          grid={state.grid}
          gridType={state.gameType}
          onSubmitClue={onSubmitClue}
          players={players}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
