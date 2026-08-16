// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from '@hooks/useSlideShow';
import { useStep } from '@hooks/useStep';
// Icons
import { CashRegisterIcon } from '@icons/CashRegisterIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseRevealState } from './utils/types';
import { COLEGAS_DE_QUARTO_PHASES } from './utils/constants';
import { HappinessHighlight } from './components/Highlights';
import { StepRanking } from './StepRanking';
import { StepGallery } from './StepGallery';
import { StepResult } from './StepResult';

export function PhaseReveal({ players, state }: PhaseProps<PhaseRevealState>) {
  const { step, goToNextStep, setStep } = useStep(0);

  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: 8,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.reset();
    setStep(0);
  };

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COLEGAS_DE_QUARTO_PHASES.REVEAL}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CashRegisterIcon />}
          title={
            <Translate
              pt="Compramos ou não?"
              en="Should we buy it?"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          unskippable
          duration={[10, 5, 3]?.[state.round.current - 1] ?? 3}
          onClose={goToNextStep}
        >
          <Surface>
            <Translate
              en="If at least 1 player gets a clue right, the house earns <happinessPoints>ponto</happinessPoints> and for each player who gets the final thing right, the house earns <finalPoints>pontos</finalPoints>.<br />For each pair you get right you earn {guessPoints} and the clue creator earns {guessedPoints}."
              pt="Se pelo menos 1 jogador acerta uma pista, a casa ganha <happinessPoints>ponto</happinessPoints> e para cada jogador que acerta a coisa final, a casa ganha <finalPoints>pontos</finalPoints>.<br />Para cada par que você acerta você ganha {guessPoints} e o criador da pista ganha {guessedPoints}."
              values={{
                happinessPoints: (content) => <HappinessHighlight>1 {content}</HappinessHighlight>,
                finalPoints: (content) => <HappinessHighlight>3 {content}</HappinessHighlight>,
                guessPoints: <PointsHighlight value={2} />,
                guessedPoints: <PointsHighlight value={1} />,
              }}
            />
          </Surface>
        </PhaseAnnouncement>

        <StepGallery
          board={state.board}
          gallery={state.gallery}
          slideShowConfig={slideShowConfig}
          players={players}
          round={state.round}
        />

        <StepResult
          players={players}
          board={state.board}
          foundTarget={state.foundTarget}
          targetId={state.targetId}
          round={state.round}
          goToNextStep={goToNextStep}
          happiness={state.happiness}
        />

        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          gallery={state.gallery}
          goBack={onGoBack}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
