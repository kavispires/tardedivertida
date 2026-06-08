import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import { useOnSubmitHumanInquiryAPIRequest } from './utils/api-requests';
import type { PhaseHumansAsksState } from './utils/types';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import { HumanSelectedInquiry } from './components/HumanInquiry';
import { StepHumansAsk } from './StepHumansAsk';
import { StepHumansAskWait } from './StepHumansAskWait';

export function PhaseHumansAsks({ players, state, user }: PhaseProps<PhaseHumansAsksState>) {
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step, setStep, goToNextStep } = useStep(0);

  const onSubmitHumanInquiry = useOnSubmitHumanInquiryAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<QuestionIcon />}
      title={
        <Translate
          pt="Pergunte ao alienígena"
          en="Ask the Alien"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.HUMANS_ASKS}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <HumanSelectedInquiry
              user={user}
              attributes={state.attributes}
              items={state.items}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={5}
        />

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={!isUserAlien}>
            <StepHumansAsk
              players={players}
              onSubmitHumanInquiry={onSubmitHumanInquiry}
              user={user}
              items={state.items}
              attributes={state.attributes}
              announcement={announcement}
              status={state.status}
              requestHistory={state.requestHistory}
              inquiryHistory={state.inquiryHistory}
              isAlienBot={Boolean(state.alienBot)}
              startingAttributesIds={state.startingAttributesIds}
              knownSpriteIds={state.knownSpriteIds}
              debugMode={Boolean(state.debugMode)}
            />
          </ViewIf>

          <ViewIf condition={isUserAlien}>
            <StepHumansAskWait
              players={players}
              alien={alien}
              isUserAlien={isUserAlien}
              items={state.items}
              attributes={state.attributes}
              announcement={announcement}
              status={state.status}
              requestHistory={state.requestHistory}
              inquiryHistory={state.inquiryHistory}
              isAlienBot={Boolean(state.alienBot)}
              startingAttributesIds={state.startingAttributesIds}
              debugMode={Boolean(state.debugMode)}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
