// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { MapCityIcon } from 'icons/MapCityIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { SLIDE_DURATION } from './utils/constants';
import { StepGallery } from './StepGallery';
import { StepResults } from './StepResults';
// Icons

export function PhaseResolution({ players, state }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: SLIDE_DURATION,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.setSlideIndex(0);
    goToPreviousStep();
  };
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.PLANEJAMENTO_URBANO.RESOLUTION}>
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
              pt={<>Vamos ver se vocês, pedreiros, pensaram como o engenheiro chefe,</>}
              en={<>Let's see if you, builders, thought like the chief engineer,</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          activePlayer={activePlayer}
          city={state.city}
          cityLocationsDict={state.cityLocationsDict}
          placements={state.placements}
          gallery={state.gallery}
          slideShowConfig={slideShowConfig}
        />

        <StepResults
          players={players}
          round={state.round}
          cityLocationsDict={state.cityLocationsDict}
          placements={state.placements}
          gallery={state.gallery}
          correct={state.correct}
          status={state.status}
          onGoBack={onGoBack}
          groupScore={state.groupScore}
          gameOrder={state.gameOrder}
          controllerId={state.controllerId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
