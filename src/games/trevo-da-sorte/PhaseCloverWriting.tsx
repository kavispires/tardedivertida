// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitCluesAPIRequest } from './utils/api-requests';
import { TREVO_DA_SORTE_PHASES } from './utils/constants';
import { StepWriteClues } from './StepWriteClues';

export function PhaseCloverWriting({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitClues = useOnSubmitCluesAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TREVO_DA_SORTE_PHASES.CLOVER_WRITING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<WritingIcon />}
          title={<Translate pt="Escreva as dicas" en="Write the clues" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
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
