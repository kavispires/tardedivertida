import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage, useMock, useStep } from 'hooks';
import { useOnSubmitCrimeAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { mockCrime } from './mock';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { ImageCardPreloadHand } from 'components/cards';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { WelcomeMessage } from './RulesBlobs';
import { StepItemsSelection } from './StepItemsSelection';
import { StepCauseOfDeathSelection } from './StepCauseOfDeathSelection';
import { StepLocationSelection } from './StepLocationSelection';
import { StepReviewCrime } from './StepReviewCrime';
import { StepReasonForEvidence } from './StepReasonForEvidence';

function PhaseCrimeSelection({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, setStep, goToNextStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [selections, setSelections] = useState<SubmitCrimePayload>({});

  const onSubmitCrimeRequest = useOnSubmitCrimeAPIRequest(setStep);

  const onSubmitCrime = () => {
    onSubmitCrimeRequest(selections);
  };

  const updateSelections = (payload: SubmitCrimePayload) => {
    setSelections((s: SubmitCrimePayload) => ({ ...s, ...payload }));
    goToNextStep();
  };

  const updateSelection = (payload: SubmitCrimePayload) => {
    setSelections((s: SubmitCrimePayload) => ({ ...s, ...payload }));
  };

  useMock(() => {
    if (step === 1) {
      onSubmitCrimeRequest(mockCrime(state.groupedItems[user.itemGroupIndex]));
    }
  }, [step]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.CRIME_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor="black"
        >
          <ImageCardPreloadHand hand={Object.keys(state.items)} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="event"
          title={translate('A Convenção', 'The Convention')}
          onClose={goToNextStep}
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
          onClose={goToNextStep}
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
          onClose={goToNextStep}
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
          onClose={goToNextStep}
          duration={5}
        >
          <Instruction>
            <Translate pt="Onde que foi?" en="Where was it?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 8 */}
        <StepLocationSelection
          user={user}
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
          onClose={goToNextStep}
          duration={5}
        />

        {/* Step 10 */}
        <StepReviewCrime
          items={state.items}
          causeOfDeathTile={state.causeOfDeathTile}
          reasonForEvidenceTile={state.reasonForEvidenceTile}
          locationTiles={state.locationTiles}
          selections={selections}
          onSubmitCrime={onSubmitCrime}
          updateSelection={updateSelection}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCrimeSelection;
