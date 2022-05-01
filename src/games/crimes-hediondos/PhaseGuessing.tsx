// State & Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GuessMessage } from './components/RulesBlobs';
import { StepGuessing } from './StepGuessing';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, setStep, goToNextStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.GUESSING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="guess"
          title={translate('Tente Adivinhar', 'Try to guess')}
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
