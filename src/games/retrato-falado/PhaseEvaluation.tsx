// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { ChoiceIcon } from '@icons/ChoiceIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
import { RETRATO_FALADO_PHASES } from './utils/constants';
import type { PhaseEvaluationState } from './utils/types';
import { StepVote } from './StepVote';

export function PhaseEvaluation({ state, players, user }: PhaseProps<PhaseEvaluationState>) {
  const { step, setStep } = useStep(0);
  const [, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ChoiceIcon />}
      title={
        <Translate
          pt="Vote!"
          en="Vote!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt={<>Vote no desenho que você acha que mais parece com o monstro meliante.</>}
          en={<>Vote for the sketch that best represents the monster.</>}
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={RETRATO_FALADO_PHASES.EVALUATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepVote
          isUserTheWitness={isUserTheWitness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          onSubmitVote={onSubmitVote}
          user={user}
          players={players}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
