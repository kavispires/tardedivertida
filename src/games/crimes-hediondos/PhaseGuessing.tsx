// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GuessMessage } from './components/RulesBlobs';
import { StepGuessing } from './StepGuessing';
import { Translate } from 'components/language';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.GUESSING}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<GuessIcon />}
          title={<Translate pt="Tente Adivinhar" en="Try to guess" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <GuessMessage />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGuessing
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          players={players}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          onSubmitGuesses={onSubmitGuesses}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuessing;
