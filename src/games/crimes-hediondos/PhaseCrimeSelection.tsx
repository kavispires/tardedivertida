import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
} from '../../components';
import { WelcomeMessage } from './RulesBlobs';
import { StepItemsSelection } from './StepItemsSelection';
import { StepCauseOfDeathSelection } from './StepCauseOfDeathSelection';
import { StepLocationSelection } from './StepLocationSelection';
import { StepReviewCrime } from './StepReviewCrime';
import { StepReasonForEvidence } from './StepReasonForEvidence';
import { useOnSubmitCrimeAPIRequest } from './_api-requests';

function PhaseCrimeSelection({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<SubmitCrimePayload>({});

  const onSubmitCrimeRequest = useOnSubmitCrimeAPIRequest(setStep);

  const onSubmitCrime = () => {
    onSubmitCrimeRequest(selections);
  };

  const increaseStep = () => setStep((s: number) => ++s);

  const updateSelections = (payload: PlainObject) => {
    setSelections((s: SubmitCrimePayload) => ({ ...s, ...payload }));
    increaseStep();
  };

  const updateSelection = (payload: PlainObject) => {
    setSelections((s: SubmitCrimePayload) => ({ ...s, ...payload }));
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.CRIME_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={increaseStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="event"
          title={translate('A Convenção', 'The Convention')}
          onClose={increaseStep}
          currentRound={state?.round?.current}
          duration={30}
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
          type="skull"
          title={translate('Causa da Morte', 'Cause of Death')}
          onClose={increaseStep}
          duration={5}
        >
          <Instruction>
            <Translate pt="Como a vítima morreu?" en="How did the victim die?" />
          </Instruction>
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
          type="crime-scene"
          title={translate('Evidências?', 'Evidence?')}
          onClose={increaseStep}
          duration={5}
        >
          <Instruction>
            <Translate
              pt="Conte-nos sobre o objeto que você escolheu."
              en="Tell us about the object you selected."
            />
          </Instruction>
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
          type="location"
          title={translate('Local do Crime', 'Crime Location')}
          onClose={increaseStep}
          duration={5}
        >
          <Instruction>
            <Translate pt="Onde que foi?" en="Where was it?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 8 */}
        <StepLocationSelection
          items={state.items}
          groupedItems={state.groupedItems}
          locationTiles={state.locationTiles}
          selections={selections}
          updateSelections={updateSelections}
        />

        {/* Step 9 */}
        <PhaseAnnouncement
          type="crime-tape"
          title={translate('Revisão', 'Review')}
          onClose={increaseStep}
          duration={5}
        ></PhaseAnnouncement>

        {/* Step 10 */}
        <StepReviewCrime
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          locationTiles={state.locationTiles}
          selections={selections}
          onSubmitCrime={onSubmitCrime}
          updateSelection={updateSelection}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCrimeSelection;
