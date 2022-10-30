// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useStep } from 'hooks/useStep';
import { useOnSubmitCardsAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { ImageCardPreloadHand } from 'components/cards';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { DreamSelectionRules } from './components/RulesBlobs';
import { StepDreamsSelection } from './StepDreamsSelection';
import { DreamIcon } from 'components/icons/DreamIcon';
import { Translate } from 'components/language';

function PhaseDreamsSelections({ players, state, info, meta }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep();
  const isUserReady = useIsUserReady(players, state);

  const onSubmitCards = useOnSubmitCardsAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.DREAMS_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DreamIcon />}
          title={<Translate pt="Visite sonhos!" en="Visit dreams!" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <DreamSelectionRules />
          <ImageCardPreloadHand hand={state.table.map((entry: GImageCard) => entry.id)} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepDreamsSelection
          table={state.table}
          word={state.word}
          onSubmitCards={onSubmitCards}
          botEnabled={Boolean(meta.options?.withBots)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDreamsSelections;
