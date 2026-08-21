import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { AlienCommunicationIcon } from '@icons/AlienCommunicationIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitAlienRequestAPIRequest } from './utils/api-requests';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import type { PhaseAlienRequestState } from './utils/types';
import { StepAlienRequests } from './StepAlienRequests';
import { StepAlienRequestsWait } from './StepAlienRequestsWait';

export function PhaseAlienRequest({ players, state, user }: PhaseProps<PhaseAlienRequestState>) {
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step, setStep } = useStep();

  const onSubmitAlienRequest = useOnSubmitAlienRequestAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AlienCommunicationIcon />}
      title={
        <Translate
          en="The Alien makes a request"
          pt="O Alienígena faz um pedido"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserAlien}>
            <StepAlienRequests
              players={players}
              onSubmitAlienRequest={onSubmitAlienRequest}
              user={user}
              alien={alien}
              isUserAlien={isUserAlien}
              items={state.items}
              attributes={state.attributes}
              announcement={announcement}
              status={state.status}
              requestHistory={state.requestHistory}
              inquiryHistory={state.inquiryHistory}
              startingAttributesIds={state.startingAttributesIds}
              debugMode={Boolean(state.debugMode)}
            />
          </ViewIf>

          <ViewIf condition={!isUserAlien}>
            <StepAlienRequestsWait
              players={players}
              onSubmitAlienRequest={onSubmitAlienRequest}
              user={user}
              alien={alien}
              isUserAlien={isUserAlien}
              items={state.items}
              attributes={state.attributes}
              announcement={announcement}
              status={state.status}
              requestHistory={state.requestHistory}
              inquiryHistory={state.inquiryHistory}
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
