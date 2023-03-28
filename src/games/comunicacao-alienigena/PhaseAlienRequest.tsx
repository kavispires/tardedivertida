// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitAlienRequestAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { AlienCommunicationIcon } from 'icons/AlienCommunicationIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepAlienRequests } from './StepAlienRequests';

export function PhaseAlienRequest({ players, state, info }: PhaseProps) {
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
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_REQUEST}
    >
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <StepAlienRequests
          players={players}
          onSubmitAlienRequest={onSubmitAlienRequest}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          items={state.items}
          signs={state.signs}
          announcement={announcement}
          status={state.status}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
