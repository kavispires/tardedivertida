// Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { CountdownIcon } from 'components/icons/CountdownIcon';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);
  const isUserReady = useIsUserReady(players, state);
  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery.length);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.RESOLUTION}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CountdownIcon />}
          title={<Translate pt="Resultado" en="Results" />}
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
