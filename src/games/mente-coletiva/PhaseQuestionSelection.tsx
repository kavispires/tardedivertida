// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitQuestionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { GamePremiseRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { SheepIcon } from 'components/icons/SheepIcon';
import { StepQuestionSelection } from './StepQuestionSelection';
import { StepQuestionSelectionWaiting } from './StepQuestionSelectionWaiting';

function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitQuestion = useOnSubmitQuestionAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.QUESTION_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={3}
          circleColor={info?.appearance?.color}
        >
          <Instruction contained>
            <Translate
              pt="Somos ovelhinhas e nosso pasto está superlotado!"
              en="We are sheep and our pasture is overcrowded!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<SheepIcon />}
          title={<Translate pt="O Pasto Superlotado" en="A Overcrowded Pasture" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 40 : 10}
        >
          <GamePremiseRules activePlayer={activePlayer} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewOr orCondition={isUserTheActivePlayer}>
          <StepQuestionSelection
            players={players}
            currentQuestions={state.currentQuestions}
            onSubmitQuestion={onSubmitQuestion}
            roundType={state.roundType}
            activePlayer={activePlayer}
            pastureSize={state.pastureSize}
          />

          <StepQuestionSelectionWaiting
            activePlayer={activePlayer}
            players={players}
            roundType={state.roundType}
            pastureSize={state.pastureSize}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
