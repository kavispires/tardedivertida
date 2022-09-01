// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitChallengeAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepSelectChallenge } from './StepSelectChallenge';
import { SelectListIcon } from 'components/icons/SelectListIcon';
import { ContendersHand } from './components/ContendersHand';

function PhaseChallengeSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);

  const onSubmitChallenge = useOnSubmitChallengeAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.SUPER_CAMPEONATO.CHALLENGE_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoomContent={<ContendersHand contenders={user.contenders} />}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={4} circleColor="pink">
          <Instruction contained>
            {state.round.current === state.round.total ? (
              <Translate pt="Rodada final: Somente os finalistas!" en="Final Round: Only finalists" />
            ) : (
              <Translate pt="Quem vai ganhar a medalha de ouro?" en="Who's gonna get the gold medal?" />
            )}
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<SelectListIcon />}
          title={translate('Desafio', 'Challenge')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate pt="Qual o desafio da rodada?" en="What's the round's challenge?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepSelectChallenge
          onSubmitChallenge={onSubmitChallenge}
          challenges={state.challenges}
          userContenders={user.contenders}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseChallengeSelection;
