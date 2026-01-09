// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { ListIcon } from 'icons/ListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitChallengeAPIRequest } from './utils/api-requests';
import type { PhaseChallengeSelectionState } from './utils/type';
import { SUPER_CAMPEONATO_PHASES } from './utils/constants';
import { StepSelectChallenge } from './StepSelectChallenge';

export function PhaseChallengeSelection({ state, players, user }: PhaseProps<PhaseChallengeSelectionState>) {
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitChallenge = useOnSubmitChallengeAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ListIcon />}
      title={
        <Translate
          pt="Desafio"
          en="Challenge"
        />
      }
      currentRound={state?.round?.current}
      duration={5}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Qual o desafio da rodada?"
          en="What's the round's challenge?"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SUPER_CAMPEONATO_PHASES.CHALLENGE_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={4}
        >
          <Instruction contained>
            {state.round.current === state.round.total ? (
              <Translate
                pt="Rodada final: Somente os finalistas!"
                en="Final Round: Only finalists"
              />
            ) : (
              <Translate
                pt="Quem vai ganhar a medalha de ouro?"
                en="Who's gonna get the gold medal?"
              />
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
