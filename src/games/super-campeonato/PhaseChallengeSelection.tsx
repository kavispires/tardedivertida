// Hooks
import { useLanguage, useStep, useUser } from 'hooks';
import { useOnSubmitChallengeAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { TrendingIcon } from 'components/icons/TrendingIcon';
import { StepSelectChallenge } from './StepSelectChallenge';

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
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={4} circleColor="pink">
          <Instruction contained>
            <Translate pt="Quem vai ganhar a medalha de ouro?" en="Who's gonna get the gold medal?" />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TrendingIcon />}
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
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseChallengeSelection;
