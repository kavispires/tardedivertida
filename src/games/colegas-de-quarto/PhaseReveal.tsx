// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Icons
import { CashRegisterIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
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
    slideDuration: 5,
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
          <Instruction>
            <Translate
              pt={
                <>
                  Para cada par que você acerta você ganha <PointsHighlight>2 pontos</PointsHighlight> e o
                  criador da pista ganha <PointsHighlight>1 ponto</PointsHighlight>.
                  <br />
                  Se pelo menos 1 jogador acerta uma pista, a casa ganha{' '}
                  <HappinessHighlight>1 ponto</HappinessHighlight> e para cada jogador que acerta a coisa
                  final, a casa ganha <HappinessHighlight>3 pontos</HappinessHighlight>.
                </>
              }
              en={
                <>
                  For each pair you get right you earn <PointsHighlight>2 points</PointsHighlight> and the
                  clue creator earns <PointsHighlight>1 point</PointsHighlight>.
                  <br />
                  If at least 1 player gets a clue right, the house earns{' '}
                  <HappinessHighlight>1 point</HappinessHighlight> and for each player who gets the final
                  thing right, the house earns <HappinessHighlight>3 points</HappinessHighlight>.
                </>
              }
            />
          </Instruction>
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
