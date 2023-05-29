// State & Hooks

import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { QualitySealIcon } from 'icons/QualitySealIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseReveal({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.REVEAL}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <StepResults
          witness={witness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          mostVotes={state.mostVotes}
          witnessVote={state.witnessVote}
          user={user}
          players={players}
          goToNextStep={goToNextStep}
          announcement={announcement}
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

export default PhaseReveal;
