// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { OfferingIcon } from 'icons/OfferingIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
// Internal
import { useOnSubmitOfferingsAPIRequest } from './utils/api-requests';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import type { PhaseOfferingsState } from './utils/types';
import { StepHumansOffer } from './StepHumansOffer';

export function PhaseOfferings({ players, state, user }: PhaseProps<PhaseOfferingsState>) {
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step, setStep } = useStep();

  const onSubmitOfferings = useOnSubmitOfferingsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<OfferingIcon />}
      title={
        <Translate
          pt="Oferendas"
          en="Offerings"
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
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.OFFERINGS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepHumansOffer
          players={players}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          items={state.items}
          attributes={state.attributes}
          announcement={announcement}
          status={state.status}
          onSubmitOfferings={onSubmitOfferings}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
          startingAttributesIds={state.startingAttributesIds}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
