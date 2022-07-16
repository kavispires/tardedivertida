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
import { StepBossWaiting } from './StepBossWaiting';
import { Board } from './components/Board';
import { DiscussionIcon } from 'components/icons/DiscussionIcon';

function PhasePlayersClues({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitClues = useOnSubmitPlayerCluesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.VENDAVAL_DE_PALPITE.PLAYERS_CLUES}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoomContent={<Board players={players} clues={state.clues} board={state.board} />}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor="red"
        >
          <RoundsLeftInstruction round={state.round} lastRound={state.lastRound} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<DiscussionIcon />}
          title={translate('Reunião', 'Meeting')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  O chefe quer a próxima ideia brilhante! Escreva dicas para tentar desvendar o que o chefe
                  quer! Discuta com os outros funcionários e evitem escrever a mesma coisa. Ideias contrárias
                  não ajudam muito.
                </>
              }
              en={<>TODO</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserTheBoss}>
          <StepBossWaiting
            secretWord={state.secretWord}
            board={state.board}
            clues={state.clues}
            categories={state.categories}
            players={players}
          />

          <StepPlayerClue
            secretWord={state.secretWord}
            board={state.board}
            clues={state.clues}
            categories={state.categories}
            onSubmitClues={onSubmitClues}
            boss={boss}
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
