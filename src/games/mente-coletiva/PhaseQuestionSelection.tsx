import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SheepIcon } from 'icons/SheepIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import { useOnSubmitCustomQuestionAPIRequest, useOnSubmitQuestionAPIRequest } from './utils/api-requests';
import { MENTE_COLETIVA_PHASES } from './utils/constants';
import type { PhaseQuestionSelectionState } from './utils/types';
import { GamePremiseRules } from './components/RulesBlobs';
import { StepQuestionSelection } from './StepQuestionSelection';
import { StepQuestionSelectionWaiting } from './StepQuestionSelectionWaiting';

export function PhaseQuestionSelection({ state, players, user }: PhaseProps<PhaseQuestionSelectionState>) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitQuestion = useOnSubmitQuestionAPIRequest(setStep);
  const onSubmitCustomQuestion = useOnSubmitCustomQuestionAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SheepIcon />}
      title={
        <Translate
          pt="O Pasto Superlotado"
          en="A Overcrowded Pasture"
        />
      }
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 40 : 10}
      type="overlay"
    >
      <GamePremiseRules activePlayer={activePlayer} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MENTE_COLETIVA_PHASES.QUESTION_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={3}
        >
          <Instruction contained>
            <Translate
              pt="Somos ovelhinhas e nosso pasto está superlotado!"
              en="We are sheep and our pasture is overcrowded!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserTheActivePlayer}>
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
          </ViewIf>
          <ViewIf condition={!isUserTheActivePlayer}>
            <StepQuestionSelectionWaiting
              activePlayer={activePlayer}
              players={players}
              roundType={state.roundType}
              pastureSize={state.pastureSize}
              announcement={announcement}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
