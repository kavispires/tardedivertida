import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { CrimeSceneIcon } from 'icons/CrimeSceneIcon';
import { CrimeTapeIcon } from 'icons/CrimeTapeIcon';
import { EventIcon } from 'icons/EventIcon';
import { LocationIcon } from 'icons/LocationIcon';
import { SkullIcon } from 'icons/SkullIcon';
// Components
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseCrimeSelectionState, SubmitCrimePayload } from './utils/types';
import { useOnSubmitCrimeAPIRequest } from './utils/api-requests';
import { mockCrime } from './utils/mock';
import { WelcomeMessage } from './components/RulesBlobs';
import { StepItemsSelection } from './StepItemsSelection';
import { StepCauseOfDeathSelection } from './StepCauseOfDeathSelection';
import { StepLocationSelection } from './StepLocationSelection';
import { StepReviewCrime } from './StepReviewCrime';
import { StepReasonForEvidence } from './StepReasonForEvidence';

export function PhaseCrimeSelection({ players, state }: PhaseProps<PhaseCrimeSelectionState>) {
  const { step, setStep, goToNextStep } = useStep(0);
  const user = useUser(players, state);

  const [selections, setSelections] = useState<SubmitCrimePayload>({});

  const onSubmitCrimeRequest = useOnSubmitCrimeAPIRequest(setStep);

  const onSubmitCrime = () => {
    onSubmitCrimeRequest(selections);
  };

  const updateSelections = (payload: SubmitCrimePayload) => {
    setSelections((prevState: SubmitCrimePayload) => ({ ...prevState, ...payload }));
    goToNextStep();
  };

  const updateSelection = (payload: SubmitCrimePayload) => {
    setSelections((prevState: SubmitCrimePayload) => ({ ...prevState, ...payload }));
  };

  const onMockCrime = () => onSubmitCrimeRequest(mockCrime(state.groupedItems[user.itemGroupIndex]));

  const announcementItems = (
    <PhaseAnnouncement
      icon={<EventIcon />}
      title={<Translate pt="A Convenção" en="The Convention" />}
      currentRound={state?.round?.current}
      duration={30}
      type="overlay"
    >
      <WelcomeMessage />
    </PhaseAnnouncement>
  );

  const announcementCause = (
    <PhaseAnnouncement
      icon={<SkullIcon />}
      title={<Translate pt="Causa da Morte" en="Cause of Death" />}
      duration={3}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Como a vítima morreu?" en="How did the victim die?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  const announcementEvidence = (
    <PhaseAnnouncement
      icon={<CrimeSceneIcon />}
      title={<Translate pt="Evidências?" en="Evidence?" />}
      duration={3}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Conte-nos sobre o objeto que você escolheu."
          en="Tell us about the object you selected."
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  const announcementLocation = (
    <PhaseAnnouncement
      icon={<LocationIcon />}
      title={<Translate pt="Local do Crime" en="Crime Location" />}
      duration={3}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Onde que foi?" en="Where was it?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  const announcementReview = (
    <PhaseAnnouncement
      icon={<CrimeTapeIcon />}
      title={<Translate pt="Revisão" en="Review" />}
      duration={3}
      type="overlay"
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.CRIME_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <>
          <StepItemsSelection
            user={user}
            groupedItems={state.groupedItems}
            items={state.items}
            selections={selections}
            updateSelections={updateSelections}
            announcement={announcementItems}
          />
          <DevButton onClick={onMockCrime} size="large">
            Random Crime
          </DevButton>
        </>

        {/* Step 2 */}
        <StepCauseOfDeathSelection
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          selections={selections}
          updateSelections={updateSelections}
          goToStep={setStep}
          announcement={announcementCause}
        />

        {/* Step 3 */}
        <StepReasonForEvidence
          items={state.items}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          selections={selections}
          updateSelections={updateSelections}
          goToStep={setStep}
          announcement={announcementEvidence}
        />

        {/* Step 4 */}
        <StepLocationSelection
          user={user}
          items={state.items}
          groupedItems={state.groupedItems}
          locationTile={state.locationTile}
          selections={selections}
          updateSelections={updateSelections}
          goToStep={setStep}
          announcement={announcementLocation}
        />

        {/* Step 5 */}
        <StepReviewCrime
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          locationTile={state.locationTile}
          selections={selections}
          onSubmitCrime={onSubmitCrime}
          updateSelection={updateSelection}
          players={players}
          announcement={announcementReview}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
