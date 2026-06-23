import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { HieroglyphIcon } from '@icons/HieroglyphIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import {
  useOnSubmitNotesConfirmationAPIRequest,
  useOnSubmitAlienResponseAPIRequest,
} from './utils/api-requests';
import type { PhaseAlienAnswerState } from './utils/types';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import { StepAlienAnswers } from './StepAlienAnswers';
import { StepAlienAnswersWait } from './StepAlienAnswersWait';

export function PhaseAlienAnswer({ players, state, user }: PhaseProps<PhaseAlienAnswerState>) {
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step } = useStep();

  const onSubmitAlienResponse = useOnSubmitAlienResponseAPIRequest();
  const onConfirmNote = useOnSubmitNotesConfirmationAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<HieroglyphIcon />}
      title={
        <Translate
          pt="Resposta do Alienígena"
          en="Alien Answer"
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
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserAlien}>
            <StepAlienAnswers
              announcement={announcement}
              players={players}
              onSubmitAlienResponse={onSubmitAlienResponse}
              alien={alien}
              items={state.items}
              attributes={state.attributes}
              status={state.status}
              inquiries={state.inquiries}
              alienResponses={state.alienResponses}
              requestHistory={state.requestHistory}
              inquiryHistory={state.inquiryHistory}
              isAlienBot={Boolean(state.alienBot)}
              startingAttributesIds={state.startingAttributesIds}
              debugMode={Boolean(state.debugMode)}
            />
          </ViewIf>

          <ViewIf condition={!isUserAlien}>
            <StepAlienAnswersWait
              announcement={announcement}
              players={players}
              user={user}
              onConfirmNote={onConfirmNote}
              items={state.items}
              attributes={state.attributes}
              alien={alien}
              inquiries={state.inquiries}
              alienResponses={state.alienResponses}
              requestHistory={state.requestHistory}
              inquiryHistory={state.inquiryHistory}
              status={state.status}
              isAlienBot={Boolean(state.alienBot)}
              startingAttributesIds={state.startingAttributesIds}
              knownSpriteIds={state.knownSpriteIds}
              debugMode={Boolean(state.debugMode)}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
