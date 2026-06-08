import { useEffect } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCacheV2 } from 'hooks/useCacheV2';
import { useStep } from 'hooks/useStep';
// Icons
import { BooksIcon } from 'icons/BooksIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
// Internal
import { useOnSubmitSeedingAPIRequest } from './utils/api-requests';
import type { PhaseAlienSeedingState } from './utils/types';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import { StepSeedAlien } from './StepSeedAlien';

export function PhaseAlienSeeding({ players, state, user }: PhaseProps<PhaseAlienSeedingState>) {
  const { step, setStep } = useStep();
  const { resetCache } = useCacheV2<Dictionary<string>>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once and don't include functions
  useEffect(() => {
    resetCache();
  }, [state.phase]);

  const onSubmitSeeds = useOnSubmitSeedingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<BooksIcon />}
      title={
        <Translate
          pt="Análise de Objetos"
          en="Objects analyses"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SEEDING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSeedAlien
          onSubmitSeeds={onSubmitSeeds}
          announcement={announcement}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
