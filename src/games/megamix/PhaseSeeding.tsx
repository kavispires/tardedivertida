// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { SmsIcon } from 'icons/SmsIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitSeedAPIRequest } from './utils/api-requests';
import { StepSeeding } from './StepSeeding';

export function PhaseSeeding({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitData = useOnSubmitSeedAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SmsIcon />}
      title={<Translate pt="Seu amigo te chamou pra balada!" en="Your friend invited to the club!" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        {user?.seeds?.length > 1 ? (
          <Translate
            pt="Mas antes de ir, você tem que fazer suas obrigações..."
            en="But before that, you must finish some chores..."
          />
        ) : (
          <Translate pt="Mas antes de ir, escolha seu modelito" en="Time to get ready!!!" />
        )}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MEGAMIX.SEEDING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSeeding players={players} announcement={announcement} onSubmitData={onSubmitData} user={user} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
