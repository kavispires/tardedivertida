// Hooks
import { useLanguage, useStep, useUser } from 'hooks';
import { useOnSubmitContenderAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepSelectContenders } from './StepSelectContenders';
import { AnonymousIcon } from 'components/icons/AnonymousIcon';
import { ContendersHand } from './components/ContendersHand';

function PhaseContenderSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);

  const onSubmitContender = useOnSubmitContenderAPIRequest(setStep);

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
        <PhaseAnnouncement
          icon={<AnonymousIcon />}
          title={translate('Competidores', 'Contenders')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate pt="Quem tem chance de ganhar?" en="Who has what it takes?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepSelectContenders
          onSubmitContender={onSubmitContender}
          challenge={state.challenge}
          userContenders={user.contenders}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseContenderSelection;