import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe, useUser } from '../../hooks';
import { useOnSubmitVoteAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  translate,
  Translate,
} from '../../components';
import StepVote from './StepVote';

function PhaseEvaluation({ players, state, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const [, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.EVALUATION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="choice"
          title={translate('Vote!', 'Vote!', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={<>Vote no desenho que você acha que mais parece com o mostro meliante.</>}
              en={<>Vote for the sketch that best represents the monster.</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVote
          isUserTheWitness={isUserTheWitness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          onSubmitVote={onSubmitVote}
          user={user}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseEvaluation;
