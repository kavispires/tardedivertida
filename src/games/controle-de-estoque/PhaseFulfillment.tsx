import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Utils
import { isDevEnv } from 'utils/helpers';
// Icons
import { OnlineOrderIcon } from 'icons/OnlineOrderIcon';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES } from './utils/constants';
import { useOnSubmitFulfillmentAPIRequest } from './utils/api-requests';
import type { PhaseFulfillmentState } from './utils/types';
import { useWarehouse } from './utils/hooks';
import { OrdersHighlight } from './components/Highlights';
import { StepAnimatePreviousAction } from './StepAnimatePreviousAction';
import { StepFulfillOrder } from './StepFulfillOrder';

export function PhaseFulfillment({ players, state, user }: PhaseProps<PhaseFulfillmentState>) {
  const isFirstFulfillmentRun = state.round.current === 1;
  const { step, goToNextStep } = useStep(isFirstFulfillmentRun ? 0 : 2);
  const previousSupervisorId = state?.event?.actorId ?? 'NULL';

  const onSubmitFulfillment = useOnSubmitFulfillmentAPIRequest(goToNextStep);

  const packingAnnouncement = useMemo(
    () => (
      <PhaseAnnouncement
        icon={<ShippingBoxIcon />}
        title="Vamos embalar esses produtos!"
        currentRound={state?.round?.current}
        type="overlay"
        duration={2}
      >
        <Instruction>
          <Translate
            en="Remember where they are!"
            pt="Lembre-se de onde eles estão!"
          />
        </Instruction>
      </PhaseAnnouncement>
    ),
    [state?.round?.current],
  );

  const warehouse = useWarehouse(state.warehouseGrid);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepAnimatePreviousAction
          user={user}
          players={players}
          announcement={packingAnnouncement}
          bossIdea={state.lastBossIdea}
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          previousSupervisor={players?.[previousSupervisorId] ?? null}
          status={state.status}
          event={state.event}
          turnOrder={[]}
          goToNextStep={goToNextStep}
        />

        <PhaseAnnouncement
          icon={<OnlineOrderIcon />}
          title={
            <Translate
              pt="Atenda os pedidos!"
              en="Fulfill the orders!"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          duration={isDevEnv ? 3 : 30}
          onClose={goToNextStep}
          unskippable
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você receberá um número de pedidos para atender.
                  <br />
                  Você ganha <PointsHighlight type="positive">3 pontos</PointsHighlight> para cada produto que
                  colocou no local correto.
                  <br />
                  Alguns produtos nunca foram colocados no galpão e você pode marcá-los como fora de estoque e
                  ganhar <PointsHighlight type="positive">3 pontos</PointsHighlight> se estiver correto.
                  <br />
                  Você perde <PointsHighlight type="negative">-1 ponto</PointsHighlight> para cada produto
                  colocado no local errado.
                  <br />
                  Deixar um produto sem atender não te faz perder pontos. Você tem{' '}
                  <TimeHighlight>2 minutos</TimeHighlight>!
                </>
              }
              en={
                <>
                  You will receive a number of orders to fulfill.
                  <br />
                  You earn <PointsHighlight type="positive">3 points</PointsHighlight> for each product you
                  placed in the correct location.
                  <br />
                  Some products were never placed in the warehouse and you can mark them as out of stock and
                  earn <PointsHighlight type="positive">3 points</PointsHighlight> if you're correct.
                  <br />
                  You lose <PointsHighlight type="negative">-1 point</PointsHighlight> for each product placed
                  in the wrong location.
                  <br />
                  Leaving a product unfulfilled doesn't make you lose points. You have{' '}
                  <TimeHighlight>2 minutes</TimeHighlight>!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          time={4}
        >
          <Instruction contained>
            <Translate
              pt="Os pedidos estão chegando em até 3 rodadas."
              en="The orders are coming in up to 3 rounds."
            />
            <br />
            <Translate
              pt={
                <>
                  Para essa rodada você tem <OrdersHighlight>{user?.orders?.length ?? '?'}</OrdersHighlight>{' '}
                  pedidos para atender!
                </>
              }
              en={
                <>
                  For this round, you have <OrdersHighlight>{user?.orders?.length ?? '?'}</OrdersHighlight>{' '}
                  orders to fulfill!
                </>
              }
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 2 */}
        <StepFulfillOrder
          user={user}
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          onSubmitFulfillment={onSubmitFulfillment}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
