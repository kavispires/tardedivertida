import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useOnSubmitCluesAPIRequest } from './utils/api-requests';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { WritingIcon } from 'components/icons/WritingIcon';
import { StepWriteClues } from './StepWriteClues';

function PhaseCloverWriting({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitClues = useOnSubmitCluesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.CLOVER_WRITING}>
      <DndProvider backend={HTML5Backend}>
        <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
          {/* Step 0 */}
          <PhaseAnnouncement
            icon={<WritingIcon />}
            title={translate('Escreva as dicas', 'Write the clues')}
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
      </DndProvider>
    </PhaseContainer>
  );
}

export default PhaseCloverWriting;
