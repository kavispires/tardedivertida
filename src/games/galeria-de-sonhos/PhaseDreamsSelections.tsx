// State & Hooks
import { useStep } from 'hooks/useStep';
import { useOnSubmitCardsAPIRequest } from './utils/api-requests';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { DreamIcon } from 'icons/DreamIcon';
// Components
import { ImageCardPreloadHand } from 'components/image-cards';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { DreamSelectionRules } from './components/RulesBlobs';
import { StepDreamsSelection } from './StepDreamsSelection';
import { Translate } from 'components/language';
import { SelectedDreams } from './components/SelectedDreams';

function PhaseDreamsSelections({ players, state, info, meta }: PhaseProps) {
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
      <ImageCardPreloadHand hand={state.table.map((entry: GImageCard) => entry.id)} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.DREAMS_SELECTION}>
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

export default PhaseDreamsSelections;
