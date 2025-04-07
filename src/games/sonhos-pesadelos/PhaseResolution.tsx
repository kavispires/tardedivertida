// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Icons
import { CountdownIcon } from 'icons/CountdownIcon';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { SONHOS_PESADELOS_PHASES } from './utils/constants';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';

export function PhaseResolution({ state, players }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: 10,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.reset();
    goToPreviousStep();
  };

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={SONHOS_PESADELOS_PHASES.RESOLUTION}>
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
          slideShowConfig={slideShowConfig}
          correctGuessPoints={state.correctGuessPoints}
        />

        {/* Step 2 */}
        <StepRanking players={players} ranking={state.ranking} round={state.round} onGoBack={onGoBack} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
