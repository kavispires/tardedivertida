// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepGuessing } from './StepGuessing';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={<Translate pt="Match!" en="Combine!" />}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.GUESSING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepGuessing
          user={user}
          grid={state.grid}
          clues={state.clues}
          onSubmitGuesses={onSubmitGuesses}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuessing;
