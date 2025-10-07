// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { ChoiceIcon } from 'icons/ChoiceIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
import { RETRATO_FALADO_PHASES } from './utils/constants';
import { StepVote } from './StepVote';

export function PhaseEvaluation({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const [, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ChoiceIcon />}
      title={<Translate pt="Vote!" en="Vote!" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Vote no desenho que você acha que mais parece com o monstro meliante.</>}
          en={<>Vote for the sketch that best represents the monster.</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={RETRATO_FALADO_PHASES.EVALUATION}>
      <StepSwitcher step={step} players={players}>
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
