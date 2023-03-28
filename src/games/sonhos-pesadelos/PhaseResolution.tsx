// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { CountdownIcon } from 'icons/CountdownIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);

  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery.length);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.RESOLUTION}>
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
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

export default PhaseResolution;
