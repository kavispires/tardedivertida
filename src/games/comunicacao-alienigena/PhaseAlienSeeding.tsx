// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCache, useCacheAlternative } from 'hooks/useCache';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { BooksIcon } from 'icons/BooksIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitSeedingAPIRequest } from './utils/api-requests';
import { StepSeedAlien } from './StepSeedAlien';

export function PhaseAlienSeeding({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitSeeds = useOnSubmitSeedingAPIRequest(setStep);

  // Clear cache from previous games
  useCache({ clearCache: true });
  useCacheAlternative({ clearCache: true });

  const announcement = (
    <PhaseAnnouncement
      icon={<BooksIcon />}
      title={<Translate pt="Análise de Objetos" en="Objects analyses" />}
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SEEDING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSeedAlien
          onSubmitSeeds={onSubmitSeeds}
          announcement={announcement}
          user={user}
          items={state.items}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
