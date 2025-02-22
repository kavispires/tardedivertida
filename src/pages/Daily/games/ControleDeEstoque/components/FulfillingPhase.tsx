import { Region, TextRegion } from 'pages/Daily/components/Region';
// Ant Design Resources
import { BarChartOutlined, WarningFilled } from '@ant-design/icons';
import { Button } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import { PHASES } from '../utils/settings';
import type { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { FulfillmentBoard } from './FulfillmentBoard';
import { Orders } from './Orders';

type FulfillingPhaseProps = {
  phase: ReturnType<typeof useControleDeEstoqueEngine>['phase'];
  orders: ReturnType<typeof useControleDeEstoqueEngine>['orders'];
  warehouse: ReturnType<typeof useControleDeEstoqueEngine>['warehouse'];
  onSelectOrder: ReturnType<typeof useControleDeEstoqueEngine>['onSelectOrder'];
  onFulfill: ReturnType<typeof useControleDeEstoqueEngine>['onFulfill'];
  onTakeBack: ReturnType<typeof useControleDeEstoqueEngine>['onTakeBack'];
  onSubmit: ReturnType<typeof useControleDeEstoqueEngine>['onSubmit'];
  activeOrder: ReturnType<typeof useControleDeEstoqueEngine>['activeOrder'];
  fulfillments: ReturnType<typeof useControleDeEstoqueEngine>['fulfillments'];
  setShowResultModal: ReturnType<typeof useControleDeEstoqueEngine>['setShowResultModal'];
  isComplete: ReturnType<typeof useControleDeEstoqueEngine>['isComplete'];
  shelfWidth: number;
  latestAttempt: ReturnType<typeof useControleDeEstoqueEngine>['latestAttempt'];
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
      <div key={latestAttempt} className={shouldShakeScreen ? getAnimationClass('shakeX') : ''}>
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

        <TextRegion>
          <Instruction contained noMargin>
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
          </Instruction>
        </TextRegion>

        <Orders
          orders={orders}
          activeOrder={activeOrder}
          onSelectOrder={onSelectOrder}
          shelfWidth={shelfWidth}
          fulfillments={fulfillments}
        />

        {!isComplete && (
          <TextRegion>
            <Instruction contained noMargin>
              <Translate
                pt={<>Para desfazer um pedido, é só clicar nele na prateleira.</>}
                en={<>To undo an order, just click on it on the shelf.</>}
              />
            </Instruction>
          </TextRegion>
        )}

        {fulfillments.length === 4 && !isComplete && (
          <>
            <Region>
              <Button size="large" type="primary" onClick={onSubmit}>
                <Translate pt="Enviar pacotes" en="Send packages" />
              </Button>
            </Region>

            <TextRegion>
              <Instruction contained noMargin>
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
              </Instruction>
            </TextRegion>
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

        <TextRegion>
          <Instruction contained noMargin>
            <Translate pt="Tudo pronto, hora de entregar!" en="All set, time to deliver!" />
          </Instruction>
        </TextRegion>

        <Region>
          <Button size="large" type="primary" onClick={onSubmit}>
            <Translate pt="Enviar pacotes" en="Send packages" />
          </Button>
        </Region>

        <TextRegion>
          <Instruction contained noMargin>
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
                  ) : (
                    <></>
                  )}
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
          </Instruction>
        </TextRegion>
      </>
    );
  }

  return (
    <>
      {board}

      <TextRegion>
        <Instruction contained noMargin>
          <Translate pt="Você completou todos os pedidos!" en="You have completed all orders!" />
        </Instruction>
      </TextRegion>

      <Region>
        <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
          <Translate pt="Ver Resultado" en="Show Results" />
        </Button>
      </Region>
    </>
  );
}
