// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MapBlueprintIcon } from 'icons/MapBlueprintIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PlayerAvatarName } from 'components/player';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewIf } from 'components/views';
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
      <Instruction>
        <PlanningRules />
        <br />
        <Translate
          pt={
            <>
              Para essa rodada,{' '}
              <PlayerAvatarName
                player={architect}
                addressUser
              />{' '}
              é o engenheiro chefe.
            </>
          }
          en={
            <>
              In this round,{' '}
              <PlayerAvatarName
                player={architect}
                addressUser
              />{' '}
              is the lead engineer.
            </>
          }
        />
      </Instruction>
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
          <Instruction contained>
            <Translate
              pt="Somos arquitetos e urbanistas, e estamos planejando a cidade!"
              en="We are architects and urban planners, and we are planning a city!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
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
      </StepSwitcher>
    </PhaseContainer>
  );
}
