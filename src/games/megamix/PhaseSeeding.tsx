// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitSeedAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ExperimentIcon } from 'icons/ExperimentIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSeeding } from './StepSeeding';

export function PhaseSeeding({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitData = useOnSubmitSeedAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ExperimentIcon />}
      title={
        <Translate pt="Seus amigos te chamaram para a balada!" en="Your friend invited to to the club!" />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Mas antes de ir, você tem que fazer suas obrigações..."
          en="But before that, you need to finish your chores..."
        />
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
