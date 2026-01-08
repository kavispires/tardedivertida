// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseClueWritingState } from './utils/types';
import { COLEGAS_DE_QUARTO_PHASES } from './utils/constants';
import { StepWriteClues } from './StepWriteClues';

export function PhaseClueWriting({ players, state, user }: PhaseProps<PhaseClueWritingState>) {
  const { step } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<TDIcon />}
      title={<Translate pt="?" en="?" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={COLEGAS_DE_QUARTO_PHASES.CLUE_WRITING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepWriteClues
          user={user}
          players={players}
          announcement={announcement}
          board={state.board}
          happiness={state.happiness}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
