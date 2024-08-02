import { Button } from 'antd';
import { Translate } from 'components/language';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { Instruction } from 'components/text';
import { FulfillmentBoard } from './FulfillmentBoard';
import { BarChartOutlined, RollbackOutlined, UndoOutlined, WarningFilled } from '@ant-design/icons';
import { Region, TextRegion } from 'pages/Daily/components/Region';
import { OutOfStockArea } from './OutOfStockArea';
import { CurrentOrder } from './CurrentOrder';

type FulfillingPhaseProps = {
  warehouse: ReturnType<typeof useControleDeEstoqueEngine>['warehouse'];
  onDeliver: ReturnType<typeof useControleDeEstoqueEngine>['onDeliver'];
  onBack: ReturnType<typeof useControleDeEstoqueEngine>['onBack'];
  onSubmit: ReturnType<typeof useControleDeEstoqueEngine>['onSubmit'];
  currentOrder: ReturnType<typeof useControleDeEstoqueEngine>['currentOrder'];
  fulfillments: ReturnType<typeof useControleDeEstoqueEngine>['fulfillments'];
  setShowResultModal: ReturnType<typeof useControleDeEstoqueEngine>['setShowResultModal'];
  isComplete: ReturnType<typeof useControleDeEstoqueEngine>['isComplete'];
  shelfWidth: number;
};

export function FulfillingPhase({
  warehouse,
  currentOrder,
  fulfillments,
  onDeliver,
  onBack,
  onSubmit,
  shelfWidth,
  isComplete,
  setShowResultModal,
}: FulfillingPhaseProps) {
  const isPlacing = !!currentOrder;
  const isSending = !currentOrder && !isComplete;

  const board = (
    <Region>
      <FulfillmentBoard
        warehouse={warehouse}
        onDeliver={isSending ? () => {} : onDeliver}
        width={shelfWidth}
        fulfillments={fulfillments}
        reveal={isComplete}
      />
    </Region>
  );

  const fulfillmentOptions = (
    <div className="fulfillment-center__options">
      <Button size="large" onClick={onBack} disabled={fulfillments.length === 0}>
        <UndoOutlined />
      </Button>
      {/* <Button size="large" disabled>
        <RollbackOutlined />
      </Button> */}
    </div>
  );

  if (isPlacing) {
    return (
      <>
        {board}

        <TextRegion>
          <Instruction contained noMargin>
            <Translate
              pt="Recebemos um pedido para esse produto, onde ele está?"
              en="We received an order for this product, where is it?"
            />
          </Instruction>
        </TextRegion>

        <div className="fulfillment-center">
          {fulfillmentOptions}
          <div className="fulfillment-center__order">
            <CurrentOrder currentOrder={currentOrder} shelfWidth={shelfWidth} />
          </div>
          <OutOfStockArea onDeliver={onDeliver} fulfillments={fulfillments} width={shelfWidth} />
        </div>

        <TextRegion>
          <Instruction contained noMargin>
            <Translate
              pt={
                <>
                  Um dos pedidos não está na prateleira, coloque ele na lata de lixo.
                  <br />
                  <strong>Pedido ({fulfillments.length + 1}/5).</strong>
                  <br />
                  Você pode apertar voltar para desfazer uma entrega.
                </>
              }
              en={
                <>
                  One of the orders is not on the shelf, put it in the trash.
                  <br />
                  <strong>Order ({fulfillments.length + 1}/5).</strong>
                  <br />
                  You can press back to undo a delivery.
                </>
              }
            />
          </Instruction>
        </TextRegion>
      </>
    );
  }

  if (isSending) {
    const isMissingOutOfStock = !fulfillments.some((f) => f.shelfIndex === -1);

    return (
      <>
        {board}

        <TextRegion>
          <Instruction contained noMargin>
            <Translate pt="Tudo pronto, hora de entregar!" en="All set, time to deliver!" />
          </Instruction>
        </TextRegion>

        <div className="fulfillment-center">
          {fulfillmentOptions}
          <div className="fulfillment-center__order">
            <Button size="large" type="primary" onClick={onSubmit}>
              <Translate pt="Enviar pacotes" en="Send packages" />
            </Button>
          </div>
          <OutOfStockArea onDeliver={() => {}} fulfillments={fulfillments} width={shelfWidth} disabled />
        </div>

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
          <Translate
            pt="Parabéns, você completou todos os pedidos!"
            en="Congratulations, you have completed all orders!"
          />
        </Instruction>
      </TextRegion>

      <div className="fulfillment-center">
        <div className="fulfillment-center__options"></div>
        <div className="fulfillment-center__order">
          <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
            <Translate pt="Ver Resultado" en="Show Results" />
          </Button>
        </div>
        <OutOfStockArea onDeliver={onDeliver} fulfillments={fulfillments} width={shelfWidth} disabled />
      </div>
    </>
  );
}
