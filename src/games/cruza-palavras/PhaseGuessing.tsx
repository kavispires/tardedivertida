// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepGuessing } from './StepGuessing';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { GuessIcon } from 'components/icons/GuessIcon';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.GUESSING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<GuessIcon />}
          title={<Translate pt="Match!" en="Combine!" />}
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
