// State & Hooks
import { useOnSubmitCluesAPIRequest } from './utils/api-requests';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepWriteClues } from './StepWriteClues';

function PhaseCloverWriting({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitClues = useOnSubmitCluesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.CLOVER_WRITING}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<WritingIcon />}
          title={<Translate pt="Escreva as dicas" en="Write the clues" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate pt="Para cada par, escreva uma dica" en="For each pair, write a clue" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepWriteClues clover={user.clover} leaves={user.leaves} onSubmitClues={onSubmitClues} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCloverWriting;
