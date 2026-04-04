import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { BarChartIcon } from 'icons/BarChartIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { PhaseMetricsBuildingState } from './utils/types';
import { MEDIDAS_NAO_EXATAS_PHASES } from './utils/constants';
import { useOnSubmitMetricsAPIRequest, useOnSubmitPoolAPIRequest } from './utils/api-requests';
import { StepWaitForPresenter } from './StepWaitForPresenter';
import { StepBuildMetrics } from './StepBuildMetrics';

export function PhaseMetricsBuilding({ state, players }: PhaseProps<PhaseMetricsBuildingState>) {
  const { step, setStep, goToNextStep } = useStep();
  const [presenter, isThePresenter] = useWhichPlayerIsThe('presenterId', state, players);
  const onSubmitMetrics = useOnSubmitMetricsAPIRequest(setStep);
  const onSubmitPool = useOnSubmitPoolAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<BarChartIcon />}
      title={
        <Translate
          en="Metrics Building"
          pt="Construção de Métricas"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              O apresentador <PlayerAvatarName player={presenter} /> vai construir as métricas para essa
              rodada.
            </>
          }
          en={
            <>
              The presenter <PlayerAvatarName player={presenter} /> will build the metrics for this round.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MEDIDAS_NAO_EXATAS_PHASES.METRICS_BUILDING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        <RoundAnnouncement
          round={state.round}
          time={3}
          onPressButton={goToNextStep}
        />
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isThePresenter}>
            <StepBuildMetrics
              announcement={announcement}
              wordsDict={state.wordsDict}
              secretCardsOptionsIds={state.secretCardsOptionsIds}
              availablePoolCardsIds={state.availablePoolCardsIds}
              metricsDescriptors={state.metricsDescriptors}
              poolIds={state.poolIds}
              secretWordId={state.secretWordId}
              onSubmitMetrics={onSubmitMetrics}
              onSubmitPool={onSubmitPool}
            />
          </ViewIf>
          <ViewIf condition={!isThePresenter}>
            <StepWaitForPresenter
              announcement={announcement}
              players={players}
              presenter={presenter}
              turnOrder={state.turnOrder}
              wordsDict={state.wordsDict}
              poolIds={state.poolIds}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
