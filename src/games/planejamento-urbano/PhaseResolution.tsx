// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MapCityIcon } from 'icons/MapCityIcon';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { PLANEJAMENTO_URBANO_PHASES, SLIDE_DURATION } from './utils/constants';
import type { PhaseResolutionState } from './utils/types';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

export function PhaseResolution({ state, players }: PhaseProps<PhaseResolutionState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [architect] = useWhichPlayerIsThe('architectId', state, players);

  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: SLIDE_DURATION,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.reset();
    goToPreviousStep();
  };

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PLANEJAMENTO_URBANO_PHASES.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MapCityIcon />}
          title={<Translate pt="Resultado" en="Results" />}
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
                  Vamos ver se você, pedreiro, pensou como o engenheiro chefe.
                  <br />
                  Você ganha <PointsHighlight>2 pontos</PointsHighlight> se acertar o planejamento!
                  <br />O engenheiro chefe ganha <PointsHighlight>1 ponto</PointsHighlight> para cada jogador
                  que acertar!
                  <br />
                  Quem errar, ganha <PointsHighlight>1 ponto</PointsHighlight> para cada jogador que pensou
                  igual!
                </>
              }
              en={
                <>
                  Let's see if you, builder, thought like the lead engineer.
                  <br /> You earn <PointsHighlight>2 points</PointsHighlight> if you match the plan!
                  <br />
                  The lead engineer earns <PointsHighlight>1 point</PointsHighlight> for each player who
                  matches!
                  <br />
                  Those who miss earn <PointsHighlight>1 point</PointsHighlight> for each player who thought
                  the same!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          architect={architect}
          city={state.city}
          cityLocationsDict={state.cityLocationsDict}
          gallery={state.gallery}
          slideShowConfig={slideShowConfig}
          placements={Object.keys(state.coneCellIds).length}
          players={players}
        />

        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={onGoBack}
          gallery={state.gallery}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
