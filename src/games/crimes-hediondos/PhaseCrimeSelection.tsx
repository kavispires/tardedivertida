import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useStep } from 'hooks/useStep';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
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
import { useGameTypes } from './utils/useGameTypes';
import { CRIMES_HEDIONDOS_PHASES } from './utils/constants';
import { WelcomeMessage } from './components/RulesBlobs';
import { SelectedItems } from './components/SelectedItems';
import { StepItemsSelection } from './StepItemsSelection';
import { StepCauseOfDeathSelection } from './StepCauseOfDeathSelection';
import { StepLocationSelection } from './StepLocationSelection';
import { StepReviewCrime } from './StepReviewCrime';
import { StepReasonForEvidence } from './StepReasonForEvidence';
import { StepAboutTheVictim } from './StepAboutTheVictim';

export function PhaseCrimeSelection({ players, state, user }: PhaseProps<PhaseCrimeSelectionState>) {
  const { step, setStep, goToNextStep } = useStep(0);

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

  const onMockCrime = () => {
    const mockedCrime = mockCrime(state.groupedItems[user.itemGroupIndex]);
    setSelections(mockedCrime);
    onSubmitCrimeRequest(mockedCrime);
  };

  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 96 });

  const { isLocationGame, isVictimGame } = useGameTypes(state.items);

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

  const announcementVictim = (
    <PhaseAnnouncement
      icon={<AnonymousIcon />}
      title={<Translate pt="Sobre a Vítima" en="About the Victim" />}
      duration={3}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Quem foi a vítima?" en="Who was the victim?" />
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
    <PhaseContainer phase={state?.phase} allowedPhase={CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <SelectedItems
              items={state.items}
              weaponId={selections.weaponId ?? ''}
              evidenceId={selections.evidenceId ?? ''}
              victimId={selections.victimId ?? ''}
              locationId={selections.locationId ?? ''}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <div>
          <StepItemsSelection
            user={user}
            groupedItems={state.groupedItems}
            items={state.items}
            selections={selections}
            updateSelections={updateSelections}
            announcement={announcementItems}
            isLocationGame={isLocationGame}
            isVictimGame={isVictimGame}
            cardWidth={cardWidth}
          />
          <DevButton onClick={onMockCrime} size="large">
            Random Crime
          </DevButton>
        </div>

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
        <StepAboutTheVictim
          user={user}
          items={state.items}
          selections={selections}
          updateSelections={updateSelections}
          victimTile={state.victimTile}
          groupedItems={state.groupedItems}
          goToStep={setStep}
          announcement={announcementVictim}
          isVictimGame={isVictimGame}
        />

        {/* Step 5 */}
        <StepLocationSelection
          user={user}
          items={state.items}
          groupedItems={state.groupedItems}
          locationTile={state.locationTile}
          selections={selections}
          updateSelections={updateSelections}
          goToStep={setStep}
          announcement={announcementLocation}
          isLocationGame={isLocationGame}
        />

        {/* Step 6 */}
        <StepReviewCrime
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          victimTile={state.victimTile}
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
