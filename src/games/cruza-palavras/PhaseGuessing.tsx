// State & Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitGuessesAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from 'components';
import { StepGuessing } from './StepGuessing';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.GUESSING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="guess"
          title={translate('Match!', 'Combine!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

        {/* Step 1 */}
        <StepGuessing
          user={user}
          grid={state.grid}
          clues={state.clues}
          onSubmitGuesses={onSubmitGuesses}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuessing;
