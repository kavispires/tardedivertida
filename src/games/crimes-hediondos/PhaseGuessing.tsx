import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher } from '../../components';
import { GuessMessage } from './RulesBlobs';
import { StepGuessing } from './StepGuessing';
import { useOnSubmitGuessesAPIRequest } from './_api-requests';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const increaseStep = () => setStep((s: number) => ++s);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.GUESSING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="guess"
          title={translate('Tente Adivinhar', 'Try to guess')}
          onClose={increaseStep}
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
