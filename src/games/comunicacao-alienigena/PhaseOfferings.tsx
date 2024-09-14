// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { OfferingIcon } from 'icons/OfferingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitOfferingAPIRequest } from './utils/api-requests';
import { StepHumansOffer } from './StepHumansOffer';

export function PhaseOfferings({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step, setStep } = useStep();

  const onSubmitOffering = useOnSubmitOfferingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<OfferingIcon />}
      title={<Translate pt="Oferendas" en="Offerings" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.OFFERINGS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepHumansOffer
          players={players}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          items={state.items}
          signs={state.signs}
          announcement={announcement}
          status={state.status}
          onSubmitOffering={onSubmitOffering}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
          startingAttributes={state.startingAttributes}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
