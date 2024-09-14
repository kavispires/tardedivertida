// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { SheepIcon } from 'icons/SheepIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitCustomQuestionAPIRequest, useOnSubmitQuestionAPIRequest } from './utils/api-requests';
import { GamePremiseRules } from './components/RulesBlobs';
import { StepQuestionSelection } from './StepQuestionSelection';
import { StepQuestionSelectionWaiting } from './StepQuestionSelectionWaiting';

export function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
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
