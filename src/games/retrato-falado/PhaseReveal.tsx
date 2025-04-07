// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { QualitySealIcon } from 'icons/QualitySealIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { RETRATO_FALADO_PHASES } from './utils/constants';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';

export function PhaseReveal({ players, state }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const user = useUser(players, state);

  const [witness] = useWhichPlayerIsThe('witnessId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<QualitySealIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      duration={5}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>E o mais votado é...</>} en={<>And the one who got the most votes is...</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={RETRATO_FALADO_PHASES.REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResults
          witness={witness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          mostVotes={state.mostVotes}
          mostVoted={state.mostVoted}
          witnessVote={state.witnessVote}
          user={user}
          players={players}
          goToNextStep={goToNextStep}
          announcement={announcement}
          votes={state.votes}
        />

        {/* Step 1 */}
        <StepRanking
          ranking={state.ranking}
          players={players}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
