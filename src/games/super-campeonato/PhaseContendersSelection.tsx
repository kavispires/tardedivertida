// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitContenderAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepSelectContenders } from './StepSelectContenders';
import { ContendersHand } from './components/ContendersHand';

function PhaseContenderSelection({ state, players, info }: PhaseProps) {
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
        waitingRoomContent={<ContendersHand contenders={user.contenders} />}
      >
        {/* Step 0 */}
        <StepSelectContenders
          onSubmitContender={onSubmitContender}
          challenge={state.challenge}
          userContenders={user.contenders}
          announcement={announcement}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseContenderSelection;
