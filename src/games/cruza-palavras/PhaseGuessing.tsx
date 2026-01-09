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
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import { CRUZA_PALAVRAS_PHASES } from './utils/constants';
import type { PhaseGuessingState } from './utils/types';
import { StepGuessing } from './StepGuessing';

export function PhaseGuessing({ players, state, user }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep(0);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={
        <Translate
          pt="Match!"
          en="Combine!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora combine as dicas de cada jogador com as coordenadas corretas!
              <br />
              Basta clicar em uma das dicas no topo e então em uma das células da grade.
            </>
          }
          en={
            <>
              Now match the clues from each player with the correct coordinates
              <br />
              Just click on one of the clues on top then in one of the cells in the grid.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CRUZA_PALAVRAS_PHASES.GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepGuessing
          user={user}
          grid={state.grid}
          gridType={state.gameType}
          clues={state.clues}
          onSubmitGuesses={onSubmitGuesses}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuessing;
