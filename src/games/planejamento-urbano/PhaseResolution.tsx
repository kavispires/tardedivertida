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
import { StepGallery } from './StepGallery';
import { StepResults } from './StepResults';
// Icons

export function PhaseResolution({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);
  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery.length);
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [controller] = useWhichPlayerIsThe('controllerId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.PLANEJAMENTO_URBANO.RESOLUTION}>
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
          players={players}
          activePlayer={activePlayer}
          controller={controller}
          city={state.city}
          cityLocationsDict={state.cityLocationsDict}
          placements={state.placements}
          gallery={state.gallery}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
        />

        <StepResults
          players={players}
          round={state.round}
          cityLocationsDict={state.cityLocationsDict}
          placements={state.placements}
          gallery={state.gallery}
          correct={state.correct}
          status={state.status}
          goToPreviousStep={goToPreviousStep}
          groupScore={state.groupScore}
          gameOrder={state.gameOrder}
          controllerId={state.controllerId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
