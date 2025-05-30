// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { DiscussionIcon } from 'icons/DiscussionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction, RoundsLeftInstruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitPlayerCluesAPIRequest } from './utils/api-requests';
import { VENDAVAL_DE_PALPITE_PHASES } from './utils/constants';
import { Board } from './components/Board';
import { StepPlayerClue } from './StepPlayerClue';
import { StepBossWaiting } from './StepBossWaiting';

export function PhasePlayersClues({ state, players }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitClues = useOnSubmitPlayerCluesAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <Board players={players} clues={state.clues} board={state.board} /> }}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5}>
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
