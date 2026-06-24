// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { SmsIcon } from '@icons/SmsIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitSeedAPIRequest } from './utils/api-requests';
import { MEGAMIX_PHASES } from './utils/constants';
import { StepSeeding } from './StepSeeding';

export function PhaseSeeding({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();

  const onSubmitData = useOnSubmitSeedAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SmsIcon />}
      title={
        <Translate
          pt="Seu amigo te chamou pra balada!"
          en="Your friend invited to the club!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        {user?.seeds?.length > 1 ? (
          <Translate
            pt="Mas antes de ir, você tem que fazer suas obrigações..."
            en="But before that, you must finish some chores..."
          />
        ) : (
          <Translate
            pt="Mas antes de ir, escolha seu modelito"
            en="Time to get ready!!!"
          />
        )}
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MEGAMIX_PHASES.SEEDING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSeeding
          players={players}
          announcement={announcement}
          onSubmitData={onSubmitData}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
