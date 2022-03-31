import { useEffect, useState } from 'react';
// Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from 'components';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);
  const user = useUser(players);
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
          TODO
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResults
          players={players}
          gallery={state.gallery}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
          setActiveIndex={setActiveIndex}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
