// Ant Design Resources
import { BarChartOutlined, WarningFilled } from '@ant-design/icons';
import { Button } from 'antd';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { Region, RegionText } from '@pages/Daily/components/Region';
// Internal
import { PHASES } from '../utils/settings';
import type { useEstoquistaEngine } from '../utils/useEstoquistaEngine';
import { FulfillmentBoard } from './FulfillmentBoard';
import { Orders } from './Orders';

type FulfillingPhaseProps = {
  phase: ReturnType<typeof useEstoquistaEngine>['phase'];
  orders: ReturnType<typeof useEstoquistaEngine>['orders'];
  warehouse: ReturnType<typeof useEstoquistaEngine>['warehouse'];
  onSelectOrder: ReturnType<typeof useEstoquistaEngine>['onSelectOrder'];
  onFulfill: ReturnType<typeof useEstoquistaEngine>['onFulfill'];
  onTakeBack: ReturnType<typeof useEstoquistaEngine>['onTakeBack'];
  onSubmit: ReturnType<typeof useEstoquistaEngine>['onSubmit'];
  activeOrder: ReturnType<typeof useEstoquistaEngine>['activeOrder'];
  fulfillments: ReturnType<typeof useEstoquistaEngine>['fulfillments'];
  setShowResultModal: ReturnType<typeof useEstoquistaEngine>['setShowResultModal'];
  isComplete: ReturnType<typeof useEstoquistaEngine>['isComplete'];
  shelfWidth: number;
  latestAttempt: ReturnType<typeof useEstoquistaEngine>['latestAttempt'];
};

export function FulfillingPhase({
  phase,
  orders,
  warehouse,
  activeOrder,
  fulfillments,
  onSelectOrder,
  onFulfill,
  onTakeBack,
  onSubmit,
  shelfWidth,
  isComplete,
  setShowResultModal,
  latestAttempt,
}: FulfillingPhaseProps) {
  const isFulfilling = phase === PHASES.FULFILLING && !isComplete;
  const isDelivering = phase === PHASES.DELIVERING;
  const shouldShakeScreen = latestAttempt && !isComplete;

  const board = (
    <Region>
      <div
        key={latestAttempt}
        className={shouldShakeScreen ? getAnimationClass('shakeX') : ''}
      >
        <FulfillmentBoard
          activeOrder={activeOrder}
          warehouse={warehouse}
          onFulfill={onFulfill}
          onTakeBack={onTakeBack}
          width={shelfWidth}
          fulfillments={fulfillments}
          reveal={isComplete}
        />
      </div>
    </Region>
  );

  if (isFulfilling) {
    return (
      <>
        {board}

        <RegionText>
          <Translate
            pt={
              <>
                Recebemos 5 pedidos e 4 deles estão em estoque!
                <br />
                Selecione os pedidos um a um e coloque-nos na prateleira correta.
                <br />
                <strong>Pedidos Posicionados ({fulfillments.length}/4).</strong>
              </>
            }
            en={
              <>
                We have received 5 orders and 4 of them are in stock!
                <br />
                Select the orders one by one and place them on the correct shelf.
                <br />
                <strong>Orders Placed ({fulfillments.length}/4).</strong>
              </>
            }
          />
        </RegionText>

        <Orders
          orders={orders}
          activeOrder={activeOrder}
          onSelectOrder={onSelectOrder}
          shelfWidth={shelfWidth}
          fulfillments={fulfillments}
        />

        {!isComplete && (
          <RegionText>
            <Translate
              pt={<>Para desfazer um pedido, é só clicar nele na prateleira.</>}
              en={<>To undo an order, just click on it on the shelf.</>}
            />
          </RegionText>
        )}

        {fulfillments.length === 4 && !isComplete && (
          <>
            <Region>
              <Button
                size="large"
                type="primary"
                onClick={onSubmit}
              >
                <Translate
                  pt="Enviar pacotes"
                  en="Send packages"
                />
              </Button>
            </Region>

            <RegionText>
              <Translate
                pt={
                  <>
                    Se tudo estiver nos confirmes, aperte o botão de enviar.
                    <br />
                    Você perde um coração se qualquer um deles estiver errado.
                  </>
                }
                en={
                  <>
                    If everything is in order, press the delivery button.
                    <br />
                    You lose a heart if any of them are wrong
                  </>
                }
              />
            </RegionText>
          </>
        )}
      </>
    );
  }

  if (isDelivering) {
    const isMissingOutOfStock = !fulfillments.some((f) => f.shelfIndex === -1);

    return (
      <>
        {board}

        <RegionText>
          <Translate
            pt="Tudo pronto, hora de entregar!"
            en="All set, time to deliver!"
          />
        </RegionText>

        <Region>
          <Button
            size="large"
            type="primary"
            onClick={onSubmit}
          >
            <Translate
              pt="Enviar pacotes"
              en="Send packages"
            />
          </Button>
        </Region>

        <RegionText>
          <Translate
            pt={
              <>
                <strong>Pedidos Assinalados</strong>
                {isMissingOutOfStock ? (
                  <>
                    <br />
                    <span style={{ color: 'red' }}>
                      <WarningFilled /> Você não colocou nenhum pedido na lata de lixo! Um dos produtos NÃO
                      está na prateleira!!!
                    </span>
                  </>
                ) : null}
                <br />
                Se tudo estiver nos confirmes, aperte o botão de enviar.
                <br />
                Você perde um coração se qualquer um deles estiver errado.
              </>
            }
            en={
              <>
                <strong>All Orders have been assigned</strong>
                <br />
                If everything is in order, press the delivery button.
                <br />
                You lose a heart if any of them are wrong
              </>
            }
          />
        </RegionText>
      </>
    );
  }

  return (
    <>
      {board}

      <RegionText>
        <Translate
          pt="Você completou todos os pedidos!"
          en="You have completed all orders!"
        />
      </RegionText>

      <Region>
        <Button
          onClick={() => setShowResultModal(true)}
          type="primary"
          icon={<BarChartOutlined />}
        >
          <Translate
            pt="Ver Resultado"
            en="Show Results"
          />
        </Button>
      </Region>
    </>
  );
}
