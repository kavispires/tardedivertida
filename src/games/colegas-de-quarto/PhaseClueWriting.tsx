// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { StoreIcon } from '@icons/StoreIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseClueWritingState } from './utils/types';
import { COLEGAS_DE_QUARTO_PHASES } from './utils/constants';
import { useOnSubmitCluesAPIRequest } from './utils/api-requests';
import { WaitingRoomClues } from './components/WaitingRoomClues';
import { StepWriteClues } from './StepWriteClues';

export function PhaseClueWriting({ players, state, user }: PhaseProps<PhaseClueWritingState>) {
  const { step, setStep, goToNextStep } = useStep();
  const onSubmitClues = useOnSubmitCluesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<StoreIcon />}
      title={
        <Translate
          pt="Nova Loja!"
          en="New Store!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt={<>Escreva pistas para os novos itens da loja.</>}
          en={<>Write clues for the new store items.</>}
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COLEGAS_DE_QUARTO_PHASES.CLUE_WRITING}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <WaitingRoomClues
              currentRound={state?.round.current}
              user={user}
              board={state.board}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          unskippable
        />

        {/* Step 1 */}
        <StepWriteClues
          user={user}
          players={players}
          announcement={announcement}
          board={state.board}
          happiness={state.happiness}
          round={state.round}
          onSubmitClues={onSubmitClues}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
