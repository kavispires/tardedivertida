// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
// Internal
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import type { PhaseGuessingState } from './utils/types';
import { useGameTypes } from './utils/hooks';
import { CRIMES_HEDIONDOS_PHASES } from './utils/constants';
import { GuessMessage } from './components/RulesBlobs';
import { StepGuessing } from './StepGuessing';

export function PhaseGuessing({ players, state, user }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep(0);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const { isLocationGame, isVictimGame } = useGameTypes(state.items);

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={
        <Translate
          pt="Tente Adivinhar"
          en="Try to guess"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <GuessMessage />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CRIMES_HEDIONDOS_PHASES.GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepGuessing
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          players={players}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          onSubmitGuesses={onSubmitGuesses}
          announcement={announcement}
          isLocationGame={isLocationGame}
          isVictimGame={isVictimGame}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
