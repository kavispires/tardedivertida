import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe, useUser } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import StepResults from './StepResults';
import StepRanking from './StepRanking';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const [witness] = useWhichPlayerIsThe('witnessId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="quality-seal"
          title={translate('Resultado', 'Results')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate pt={<>E o mais votado é...</>} en={<>And the one who got the most votes is...</>} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResults
          witness={witness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          mostVotes={state.mostVotes}
          witnessVote={state.witnessVote}
          user={user}
          players={players}
          setStep={setStep}
        />

        {/* Step 2 */}
        <StepRanking ranking={state.ranking} players={players} round={state.round} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;