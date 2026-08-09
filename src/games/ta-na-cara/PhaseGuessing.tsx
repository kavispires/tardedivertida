// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { AnonymousIcon } from '@icons/AnonymousIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhaseGuessingState } from './utils/types';
import { StepGuessPlayer } from './StepGuessPlayer';

export function PhaseGuessing({ state, players, user }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep();
  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnonymousIcon />}
      title={
        <Translate
          pt="Quem é essa pessoa?"
          en="Who's that?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Surface>
        <Translate
          pt={'Quem você acha que seu adversário é? Lembre-se que você só pode errar uma vez!'}
          en={'Who do you think your opponent is? Remember, you can only make one mistake!'}
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TA_NA_CARA_PHASES.GUESSING}
      hasRequiredData={!!user.targetPlayerId && !!user.guesserPlayerId}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepGuessPlayer
          announcement={announcement}
          players={players}
          user={user}
          turnOrder={state.turnOrder}
          characters={state.characters}
          questionsHistory={state.questionsHistory}
          onSubmitGuess={onSubmitGuess}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
