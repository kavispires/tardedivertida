// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DreamIcon } from 'icons/DreamIcon';
// Components
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import type { ImageCardObj } from './utils/types';
import { useOnSubmitCardsAPIRequest } from './utils/api-requests';
import { DreamSelectionRules } from './components/RulesBlobs';
import { SelectedDreams } from './components/SelectedDreams';
import { StepDreamsSelection } from './StepDreamsSelection';

export function PhaseDreamsSelections({ players, state, meta }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitCards = useOnSubmitCardsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<DreamIcon />}
      title={<Translate pt="Visite sonhos!" en="Visit dreams!" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <DreamSelectionRules hardModeEnabled={Boolean(meta.options?.hardMode)} />
      <ImageCardPreloadHand hand={state.table.map((entry: ImageCardObj) => entry.id)} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.DREAMS_SELECTION}>
      <StepSwitcher step={step} players={players} waitingRoom={{ content: <SelectedDreams user={user} /> }}>
        {/* Step 0 */}
        <StepDreamsSelection
          table={state.table}
          word={state.word}
          onSubmitCards={onSubmitCards}
          botEnabled={Boolean(meta.options?.withBots)}
          hardModeEnabled={Boolean(meta.options?.hardMode)}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
