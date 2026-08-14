// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from '@hooks/useSlideShow';
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { MapCityIcon } from '@icons/MapCityIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
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
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PLANEJAMENTO_URBANO_PHASES.RESOLUTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MapCityIcon />}
          title={
            <Translate
              pt="Resultado"
              en="Results"
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
              pt={
                <>
                  Vamos ver se você, pedreiro, pensou como o engenheiro chefe.
                  <br />
                  Você ganha <PointsHighlight value={3} /> se acertar o planejamento!
                  <br />O engenheiro chefe ganha <PointsHighlight value={1} /> para cada jogador que acertar!
                  <br />
                  Quem errar, ganha <PointsHighlight value={1} /> para cada jogador que pensou igual!
                </>
              }
              en={
                <>
                  Let's see if you, builder, thought like the lead engineer.
                  <br /> You earn <PointsHighlight value={3} /> if you match the plan!
                  <br />
                  The lead engineer earns <PointsHighlight value={1} /> for each player who matches!
                  <br />
                  Those who miss earn <PointsHighlight value={1} /> for each player who thought the same!
                </>
              }
            />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          architect={architect}
          city={state.city}
          cityLocationsDict={state.cityLocationsDict}
          coneCellIds={state.coneCellIds}
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
