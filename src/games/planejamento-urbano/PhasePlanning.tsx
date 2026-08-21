import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { MapBlueprintIcon } from '@icons/MapBlueprintIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitPlanningAPIRequest } from './utils/api-requests';
import { PLANEJAMENTO_URBANO_PHASES } from './utils/constants';
import type { PhasePlanningState } from './utils/types';
import { PlanningRules } from './components/RulesBlobs';
import { StepPlanLocations } from './StepPlanLocations';
import { StepWaitForPlanning } from './StepWaitForPlanning';

export function PhasePlanning({ state, players }: PhaseProps<PhasePlanningState>) {
  const { step, goToNextStep, setStep } = useStep();
  const [architect, isTheArchitect] = useWhichPlayerIsThe('architectId', state, players);

  const onSubmitPlanning = useOnSubmitPlanningAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MapBlueprintIcon />}
      title={
        <Translate
          pt="Planejamento"
          en="Planning"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <PlanningRules />
        <br />
        <Translate
          pt="Para essa rodada, {architect} é o engenheiro chefe."
          en="In this round, {architect} is the lead engineer."
          values={{
            architect: (
              <PlayerAvatarName
                player={architect}
                addressUser
              />
            ),
          }}
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PLANEJAMENTO_URBANO_PHASES.PLANNING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={3}
        >
          <Surface contained>
            <Translate
              pt="Somos arquitetos e urbanistas, e estamos planejando a cidade!"
              en="We are architects and urban planners, and we are planning a city!"
            />
          </Surface>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isTheArchitect}>
            <StepPlanLocations
              announcement={announcement}
              players={players}
              architectId={state.architectId}
              gameOrder={state.gameOrder}
              city={state.city}
              cityLocationsDict={state.cityLocationsDict}
              placements={Object.keys(state.coneCellIds).length}
              availableProjectsIds={state.availableProjectsIds}
              onSubmitPlanning={onSubmitPlanning}
            />
          </ViewIf>
          <ViewIf condition={!isTheArchitect}>
            <StepWaitForPlanning
              announcement={announcement}
              players={players}
              gameOrder={state.gameOrder}
              architect={architect}
              city={state.city}
              cityLocationsDict={state.cityLocationsDict}
              placements={Object.keys(state.coneCellIds).length}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
