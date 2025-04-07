// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MapCityZonesIcon } from 'icons/MapCityZonesIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitPlacingAPIRequest, useOnUpdatePlacementAPIRequest } from './utils/api-requests';
import { PLANEJAMENTO_URBANO_PHASES } from './utils/constants';
import { StepPlaceLocations } from './StepPlaceLocations';
// Icons

export function PhasePlacing({ players, state }: PhaseProps) {
  const { step, setStep } = useStep();
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [controller, isTheController] = useWhichPlayerIsThe('controllerId', state, players);
  const onSubmitConstruction = useOnSubmitPlacingAPIRequest(setStep);
  const onUpdateConstruction = useOnUpdatePlacementAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<MapCityZonesIcon />}
      title={<Translate pt="Construção" en="Construction" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora, é hora de colocar as construções de acordo com o planejamento do engenheiro chefe.
              <br />
              <AvatarName player={controller} addressUser /> é o responsável por essa etapa.
            </>
          }
          en={
            <>
              Now, it's time to place the buildings according to the chief engineer's planning.
              <br />
              <AvatarName player={controller} addressUser /> is responsible for this step.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PLANEJAMENTO_URBANO_PHASES.PLACING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepPlaceLocations
          announcement={announcement}
          players={players}
          activePlayer={activePlayer}
          controller={controller}
          gameOrder={state.gameOrder}
          city={state.city}
          cityLocationsDict={state.cityLocationsDict}
          placements={state.placements}
          availableProjectsIds={state.availableProjectsIds}
          onSubmitConstruction={onSubmitConstruction}
          onUpdateConstruction={onUpdateConstruction}
          evaluations={state.evaluations ?? {}}
          planning={state.planning ?? {}}
          isTheController={isTheController}
          isTheActivePlayer={isTheActivePlayer}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
