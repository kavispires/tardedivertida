// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { CountdownIcon } from 'icons/CountdownIcon';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';

export function PhaseResolution({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);

  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery.length);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CountdownIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Acertos ganham <PointsHighlight>{state.correctGuessPoints}</PointsHighlight> pontos nessa
                  rodada.
                </>
              }
              en={
                <>
                  Correct guesses get <PointsHighlight>{state.correctGuessPoints}</PointsHighlight> points
                  this round.
                </>
              }
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
