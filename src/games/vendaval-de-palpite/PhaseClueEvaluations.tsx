// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { LoupeIcon } from 'icons/LoupeIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitEvaluationAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { StepBossEvaluation } from './StepBossEvaluation';
import { StepPlayersWaitEvaluation } from './StepPlayersWaitEvaluation';

export function PhaseClueEvaluations({ state, players }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitEvaluation = useOnSubmitEvaluationAPIRequest(setStep);
  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.VENDAVAL_DE_PALPITE.CLUE_EVALUATIONS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<LoupeIcon />}
          title={<Translate pt="Avaliação das Pistas" en="Clue Evaluation" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
          type="block"
        >
          <Instruction>
            <Translate
              pt={<>Os jogadores agora escrevem dicas para tentar adivinhar a palavra secreta.</>}
              en={<>Players now write clues to try to guess the secret word.</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr condition={isUserTheBoss}>
          <StepBossEvaluation
            secretWord={state.secretWord}
            board={state.board}
            clues={state.clues}
            categories={state.categories}
            onSubmitEvaluation={onSubmitEvaluation}
            onSubmitOutcome={onSubmitOutcome}
            finalAnswersLeft={state.finalAnswersLeft}
            players={players}
            round={state.round}
            outcome={state.outcome}
          />

          <StepPlayersWaitEvaluation
            board={state.board}
            clues={state.clues}
            categories={state.categories}
            boss={boss}
            finalAnswersLeft={state.finalAnswersLeft}
            players={players}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
