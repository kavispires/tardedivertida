// Hooks
import { useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import {
  useOnSubmitEvaluationAPIRequest,
  useOnSubmitHelpAPIRequest,
  useOnSubmitOutcomeAPIRequest,
} from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { StepMasterEvaluation } from './StepMasterEvaluation';
import { StepPlayersWaitEvaluation } from './StepPlayersWaitEvaluation';

function PhaseClueEvaluations({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, setStep, goToNextStep } = useStep(0);
  const [master, isUserTheMaster] = useWhichPlayerIsThe('masterId', state, players);

  const onSubmitEvaluation = useOnSubmitEvaluationAPIRequest(setStep);
  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);
  const onSubmitHelp = useOnSubmitHelpAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.VENDAVAL_DE_PALPITE.CLUE_EVALUATIONS}
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="loupe"
          title={translate('Avaliação das Pistas', 'Clue Evaluation')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate
              pt={<>Os jogadores agora escrevem dicas para tentar adivinhar a palavra secreta.</>}
              en={<>Players now write clues to try to guess the secret word.</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserTheMaster}>
          <StepMasterEvaluation
            secretWord={state.secretWord}
            board={state.board}
            categories={state.categories}
            onSubmitEvaluation={onSubmitEvaluation}
            onSubmitOutcome={onSubmitOutcome}
            onSubmitHelp={onSubmitHelp}
            finalAnswersLeft={state.finalAnswersLeft}
            players={players}
            round={state.round}
            outcome={state.outcome}
          />

          <StepPlayersWaitEvaluation
            board={state.board}
            categories={state.categories}
            master={master}
            finalAnswersLeft={state.finalAnswersLeft}
            players={players}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseClueEvaluations;