import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { LoupeIcon } from '@icons/LoupeIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitEvaluationAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { VENDAVAL_DE_PALPITE_PHASES } from './utils/constants';
import { StepBossEvaluation } from './StepBossEvaluation';
import { StepPlayersWaitEvaluation } from './StepPlayersWaitEvaluation';

export function PhaseClueEvaluations({ state, players }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitEvaluation = useOnSubmitEvaluationAPIRequest(setStep);
  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<LoupeIcon />}
          title={
            <Translate
              pt="Avaliação das Pistas"
              en="Clue Evaluation"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
          type="block"
        >
          <Surface>
            <Translate
              pt={<>Os jogadores agora escrevem dicas para tentar adivinhar a palavra secreta.</>}
              en={<>Players now write clues to try to guess the secret word.</>}
            />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserTheBoss}>
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
          </ViewIf>
          <ViewIf condition={!isUserTheBoss}>
            <StepPlayersWaitEvaluation
              board={state.board}
              clues={state.clues}
              categories={state.categories}
              boss={boss}
              finalAnswersLeft={state.finalAnswersLeft}
              players={players}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
