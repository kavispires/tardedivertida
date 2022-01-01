import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CRIMES_HEDIONDOS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import { GenericMessage, WelcomeMessage } from './RulesBlobs';
import { StepItemsSelection } from './StepItemsSelection';
import { StepCauseOfDeathSelection } from './StepCauseOfDeathSelection';
import { StepLocationSelection } from './StepLocationSelection';
import { StepReviewCrime } from './StepReviewCrime';
import { StepReasonForEvidence } from './StepReasonForEvidence';

function PhaseCrimeSelection({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<PlainObject>({});

  const onSubmitCrimeAPIRequest = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-crime',
    onBeforeCall: () => setStep(10),
    onError: () => setStep(9),
    successMessage: translate('Crime enviado com sucesso', 'Crime submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu crime',
      'Oops, the application failed to send your crime',
      language
    ),
  });

  const onSubmitCrime = () => {
    onSubmitCrimeAPIRequest({
      action: 'SUBMIT_CRIME',
      ...selections,
    });
  };

  const increaseStep = () => setStep((s: number) => ++s);

  const updateSelections = (payload: PlainObject) => {
    setSelections((s: PlainObject) => ({ ...s, ...payload }));
    increaseStep();
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.CRIME_SELECTION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam!',
          'Please wait while other players finish!',
          language
        )}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={increaseStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="multitask"
          title={translate('A Convenção', 'The Convention', language)}
          onClose={increaseStep}
          currentRound={state?.round?.current}
        >
          <WelcomeMessage />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepItemsSelection
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          selections={selections}
          updateSelections={updateSelections}
        />

        {/* Step 3 */}
        <PhaseAnnouncement
          type="multitask"
          title={translate('Causa da Morte', 'Cause of Death', language)}
          onClose={increaseStep}
          duration={5}
        >
          <Translate pt="Como a vítima morreu?" en="How did the victim die?" />
        </PhaseAnnouncement>

        {/* Step 4 */}
        <StepCauseOfDeathSelection
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          selections={selections}
          updateSelections={updateSelections}
        />

        {/* Step 5 */}
        <PhaseAnnouncement
          type="multitask"
          title={translate('Evidências?', 'Evidence?', language)}
          onClose={increaseStep}
          duration={5}
        >
          <GenericMessage />
        </PhaseAnnouncement>

        {/* Step 6 */}
        <StepReasonForEvidence
          items={state.items}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          selections={selections}
          updateSelections={updateSelections}
        />

        {/* Step 7 */}
        <PhaseAnnouncement
          type="multitask"
          title={translate('Local do Crime', 'Crime Location', language)}
          onClose={increaseStep}
          duration={5}
        >
          <GenericMessage />
        </PhaseAnnouncement>

        {/* Step 8 */}
        <StepLocationSelection
          items={state.items}
          locationTiles={state.locationTiles}
          selections={selections}
          updateSelections={updateSelections}
        />

        {/* Step 9 */}
        <StepReviewCrime
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          locationTiles={state.locationTiles}
          selections={selections}
          onSubmitCrime={onSubmitCrime}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCrimeSelection;
