// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { AlienCommunicationIcon } from 'icons/AlienCommunicationIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitAlienRequestAPIRequest } from './utils/api-requests';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import { StepAlienRequests } from './StepAlienRequests';

export function PhaseAlienRequest({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step, setStep } = useStep();

  const onSubmitAlienRequest = useOnSubmitAlienRequestAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AlienCommunicationIcon />}
      title={<Translate pt="O Alienígena faz um pedido" en="The Alien makes a request" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
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
      </StepSwitcher>
    </PhaseContainer>
  );
}
