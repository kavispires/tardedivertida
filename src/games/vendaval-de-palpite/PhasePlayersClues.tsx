// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitPlayerCluesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { DiscussionIcon } from 'icons/DiscussionIcon';
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

export function PhasePlayersClues({ state, players, info }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitClues = useOnSubmitPlayerCluesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.VENDAVAL_DE_PALPITE.PLAYERS_CLUES}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <Board players={players} clues={state.clues} board={state.board} /> }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor={info?.appearance?.color}
        >
          <RoundsLeftInstruction round={state.round} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<DiscussionIcon />}
          title={<Translate pt="Reunião" en="Meeting" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
          type="block"
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
        <ViewOr condition={isUserTheBoss}>
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
