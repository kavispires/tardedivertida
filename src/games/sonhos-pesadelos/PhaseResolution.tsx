import { useEffect, useState } from 'react';
// Hooks
import { useIsUserReady, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, StepSwitcher, Translate } from 'components';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);

  const isUserReady = useIsUserReady(players, state);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFirstGalleryRunThrough, setIsFirstGalleryRunThrough] = useState(true);

  // Changes isFirstGalleryRunThrough property which disables controls, after the first gallery run through
  useEffect(() => {
    if (isFirstGalleryRunThrough && step > 1) {
      setIsFirstGalleryRunThrough(false);
    }
  }, [step, isFirstGalleryRunThrough]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.RESOLUTION}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="countdown"
          title={translate('Resultado', 'Results')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={<>Acertos ganham {state.correctGuessPoints} pontos nessa rodada.</>}
              en={<>Correct guesses get {state.correctGuessPoints} points this round.</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResults
          players={players}
          gallery={state.gallery}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
          correctGuessPoints={state.correctGuessPoints}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
          setActiveIndex={setActiveIndex}
          correctGuessPoints={state.correctGuessPoints}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
