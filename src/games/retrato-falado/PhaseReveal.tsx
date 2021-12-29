import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe, useUser } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/constants';
// Components
import {
  WaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  translate,
  Translate,
} from '../../components';
import StepResults from './StepResults';
import StepRanking from './StepRanking';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const [witness] = useWhichPlayerIsThe('witnessId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="quality-seal"
          title={translate('Resultado', 'Results', language)}
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
        <StepRanking ranking={state.ranking} players={players} language={language} round={state.round} />

        {/* Step 3 */}
        <Step fullWidth>
          <WaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
