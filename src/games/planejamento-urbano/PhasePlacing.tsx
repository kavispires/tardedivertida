// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MapCityZonesIcon } from 'icons/MapCityZonesIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitPlacingAPIRequest } from './utils/api-requests';
import { PLANEJAMENTO_URBANO_PHASES } from './utils/constants';
import type { PhasePlacingState } from './utils/types';
import { StepPlaceLocations } from './StepPlaceLocations';
// Icons

export function PhasePlacing({ state, players }: PhaseProps<PhasePlacingState>) {
  const { step, setStep } = useStep();
  const [architect, isTheArchitect] = useWhichPlayerIsThe('architectId', state, players);
  const onSubmitConstruction = useOnSubmitPlacingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MapCityZonesIcon />}
      title={
        <Translate
          pt="Construção"
          en="Construction"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Agora, é hora de colocar as construções de acordo com o planejamento do engenheiro chefe.</>}
          en={<>Now, it's time to place the buildings according to the lead engineer's planning.</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PLANEJAMENTO_URBANO_PHASES.PLACING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepPlaceLocations
          announcement={announcement}
          players={players}
          architect={architect}
          gameOrder={state.gameOrder}
          city={state.city}
          cityLocationsDict={state.cityLocationsDict}
          placements={Object.keys(state.coneCellIds).length}
          availableProjectsIds={state.availableProjectsIds}
          onSubmitConstruction={onSubmitConstruction}
          planning={state.planning ?? {}}
          isTheArchitect={isTheArchitect}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
