// Hooks
import { useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitPlayerCluesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, RoundsLeftInstruction } from 'components/text';
import { Translate } from 'components/language';
import { StepPlayerClue } from './StepPlayerClue';
import { RoundAnnouncement } from 'components/round';
import { ViewOr } from 'components/views';
import { StepMasterWaiting } from './StepMasterWaiting';

function PhasePlayersClues({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, setStep, goToNextStep } = useStep(0);
  const [master, isUserTheMaster] = useWhichPlayerIsThe('masterId', state, players);

  const onSubmitClues = useOnSubmitPlayerCluesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.VENDAVAL_DE_PALPITE.PLAYERS_CLUES}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor="red"
        >
          <RoundsLeftInstruction round={state.round} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="discussion"
          title={translate('Escrevam dicas', 'Write clues')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Os jogadores agora escrevem dicas para tentar adivinhar a palavra secreta, discutam entre si
                  e evitem escrever a mesma coisa
                </>
              }
              en={
                <>
                  Players now write clues to try to guess the secret word. Discuss among yourselves and avoid
                  writing the same thing
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserTheMaster}>
          <StepMasterWaiting
            secretWord={state.secretWord}
            board={state.board}
            categories={state.categories}
            players={players}
          />

          <StepPlayerClue
            secretWord={state.secretWord}
            board={state.board}
            categories={state.categories}
            onSubmitClues={onSubmitClues}
            master={master}
            finalAnswersLeft={state.finalAnswersLeft}
            cluesPerPlayer={state.cluesPerPlayer}
            players={players}
            round={state.round}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhasePlayersClues;
