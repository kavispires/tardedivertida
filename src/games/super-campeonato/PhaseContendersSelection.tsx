// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitContenderAPIRequest } from './utils/api-requests';
import { ContendersHand } from './components/ContendersHand';
import { StepSelectContenders } from './StepSelectContenders';

export function PhaseContenderSelection({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitContender = useOnSubmitContenderAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnonymousIcon />}
      title={<Translate pt="Competidores" en="Contenders" />}
      type="overlay"
      currentRound={state?.round?.current}
      duration={5}
    >
      <Instruction>
        <Translate pt="Quem tem chance de ganhar?" en="Who has what it takes?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.SUPER_CAMPEONATO.CONTENDER_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <ContendersHand contenders={user.contenders} /> }}
      >
        {/* Step 0 */}
        <StepSelectContenders
          onSubmitContender={onSubmitContender}
          challenge={state.challenge}
          userContenders={user.contenders}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
