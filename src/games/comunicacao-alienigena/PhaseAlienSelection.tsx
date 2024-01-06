// State & Hooks
import { useStep } from 'hooks/useStep';
import { useCache } from 'hooks/useCache';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitAlienAPIRequest } from './utils/api-requests';
// Icons
import { UfoIcon } from 'icons/UfoIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSelectAlien } from './StepSelectAlien';

export function PhaseAlienSelection({ players, state, info }: PhaseProps) {
  const { step, setStep } = useStep();

  // Clear cache from previous games
  useCache({ clearCache: true });

  const onSubmitAlien = useOnSubmitAlienAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<UfoIcon />}
      title={<Translate pt="Quem quer ser o alienígena?" en="Who will be the Alien?" />}
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SELECTION}
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSelectAlien
          players={players}
          onSubmitAlien={onSubmitAlien}
          announcement={announcement}
          status={state.status}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
