// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
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
import { GALERIA_DE_SONHOS_PHASES } from './utils/constants';
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
      <DreamSelectionRules minimumSelection={state.minimumSelection} />
      <ImageCardPreloadHand hand={state.table.map((entry: ImageCardObj) => entry.id)} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={GALERIA_DE_SONHOS_PHASES.DREAMS_SELECTION}>
      <StepSwitcher step={step} players={players} waitingRoom={{ content: <SelectedDreams user={user} /> }}>
        {/* Step 0 */}
        <StepDreamsSelection
          table={state.table}
          word={state.word}
          onSubmitCards={onSubmitCards}
          botEnabled={Boolean(meta.options?.withBots)}
          minimumSelection={state.minimumSelection}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
