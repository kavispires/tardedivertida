// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitChallengeAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ListIcon } from 'icons/ListIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepSelectChallenge } from './StepSelectChallenge';

export function PhaseChallengeSelection({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitChallenge = useOnSubmitChallengeAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ListIcon />}
      title={<Translate pt="Desafio" en="Challenge" />}
      currentRound={state?.round?.current}
      duration={5}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Qual o desafio da rodada?" en="What's the round's challenge?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.SUPER_CAMPEONATO.CHALLENGE_SELECTION}
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={4}
          circleColor={info?.appearance?.color}
        >
          <Instruction contained>
            {state.round.current === state.round.total ? (
              <Translate pt="Rodada final: Somente os finalistas!" en="Final Round: Only finalists" />
            ) : (
              <Translate pt="Quem vai ganhar a medalha de ouro?" en="Who's gonna get the gold medal?" />
            )}
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <StepSelectChallenge
          onSubmitChallenge={onSubmitChallenge}
          challenges={state.challenges}
          userContenders={user.contenders}
          round={state.round}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
