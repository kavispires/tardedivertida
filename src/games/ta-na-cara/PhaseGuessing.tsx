// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhaseGuessingState } from './utils/types';
import { StepMakeYourGuesses } from './StepMakeYourGuesses';

export function PhaseGuessing({ state, players, user, meta }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep();

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={<Translate pt="Quem é quem?" en="Who is who?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.GUESSING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepMakeYourGuesses
          gameId={meta.gameId}
          players={players}
          user={user}
          grid={state.grid}
          identitiesDict={state.identitiesDict}
          questionsDict={state.questionsDict}
          announcement={announcement}
          onSubmitGuesses={onSubmitGuesses}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
