// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { useOnSubmitCustomQuestionAPIRequest, useOnSubmitQuestionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { SheepIcon } from 'icons/SheepIcon';
// Components
import { GamePremiseRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { StepQuestionSelection } from './StepQuestionSelection';
import { StepQuestionSelectionWaiting } from './StepQuestionSelectionWaiting';

function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitQuestion = useOnSubmitQuestionAPIRequest(setStep);
  const onSubmitCustomQuestion = useOnSubmitCustomQuestionAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SheepIcon />}
      title={<Translate pt="O Pasto Superlotado" en="A Overcrowded Pasture" />}
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 40 : 10}
      type="overlay"
    >
      <GamePremiseRules activePlayer={activePlayer} />
    </PhaseAnnouncement>
  );

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
        <ViewOr condition={isUserTheActivePlayer}>
          <StepQuestionSelection
            players={players}
            currentQuestions={state.currentQuestions}
            onSubmitQuestion={onSubmitQuestion}
            onSubmitCustomQuestion={onSubmitCustomQuestion}
            roundType={state.roundType}
            activePlayer={activePlayer}
            pastureSize={state.pastureSize}
            user={user}
            announcement={announcement}
          />

          <StepQuestionSelectionWaiting
            activePlayer={activePlayer}
            players={players}
            roundType={state.roundType}
            pastureSize={state.pastureSize}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
