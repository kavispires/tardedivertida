// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MapBlueprintIcon } from 'icons/MapBlueprintIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitPlanningAPIRequest } from './utils/api-requests';
import { PLANEJAMENTO_URBANO_PHASES } from './utils/constants';
import { PlanningRules } from './components/RulesBlobs';
import { StepPlanLocations } from './StepPlanLocations';
import { StepWaitForPlanning } from './StepWaitForPlanning';
// Icons

export function PhasePlanning({ players, state }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep();
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const onSubmitPlanning = useOnSubmitPlanningAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MapBlueprintIcon />}
      title={<Translate pt="Planejamento" en="Planning" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <PlanningRules />
        <br />
        <Translate
          pt={
            <>
              Para essa rodada, <AvatarName player={activePlayer} addressUser /> é o engenheiro chefe.
            </>
          }
          en={
            <>
              In this round, <AvatarName player={activePlayer} addressUser /> is the chief engineer.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PLANEJAMENTO_URBANO_PHASES.PLANNING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={3}>
          <Instruction contained>
            <Translate
              pt="Somos arquitetos e urbanistas, e estamos planejando a cidade!"
              en="We are architects and urban planners, and we are planning a city!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <ViewOr condition={isTheActivePlayer}>
          <StepPlanLocations
            announcement={announcement}
            players={players}
            activePlayerId={state.activePlayerId}
            gameOrder={state.gameOrder}
            city={state.city}
            cityLocationsDict={state.cityLocationsDict}
            placements={state.placements}
            availableProjectsIds={state.availableProjectsIds}
            onSubmitPlanning={onSubmitPlanning}
          />

          <StepWaitForPlanning
            announcement={announcement}
            players={players}
            gameOrder={state.gameOrder}
            activePlayer={activePlayer}
            city={state.city}
            cityLocationsDict={state.cityLocationsDict}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
