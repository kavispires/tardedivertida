import { useState } from 'react';
// Hooks
import { useLanguage, useWhichPlayerIsThe } from '../../hooks';
import { useOnSubmitQuestionAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  ViewIf,
} from '../../components/shared';
import { QuestionSelectionWaiting } from './QuestionSelectionWaiting';
import { QuestionSelection } from './QuestionSelection';
import { GamePremiseRules } from './RulesBlobs';

function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [step, setStep] = useState(0);

  const onSubmitQuestion = useOnSubmitQuestionAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.QUESTION_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={3} circleColor="white">
          <Instruction contained>
            <Translate
              pt="Somos ovelhinhas e nosso pasto está superlotado!"
              en="We are sheep and our pasture is overcrowded!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="sheep"
          title={translate('O Pasto Superlotado', 'A Overcrowded Pasture')}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 40 : 10}
        >
          <GamePremiseRules activePlayer={activePlayer} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheActivePlayer}>
            <QuestionSelection
              players={players}
              currentQuestions={state.currentQuestions}
              onSubmitQuestion={onSubmitQuestion}
              roundType={state.roundType}
              activePlayer={activePlayer}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheActivePlayer}>
            <QuestionSelectionWaiting
              activePlayer={activePlayer}
              players={players}
              roundType={state.roundType}
            />
          </ViewIf>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
