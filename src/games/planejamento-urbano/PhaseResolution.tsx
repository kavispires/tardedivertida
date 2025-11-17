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
          duration={3}
          onClose={goToNextStep}
        >
          <Instruction>
            <Translate
              pt={<>Vamos ver se você, pedreiro, pensou como o engenheiro chefe.</>}
              en={<>Let's see if you, builder, thought like the lead engineer.</>}
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
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
