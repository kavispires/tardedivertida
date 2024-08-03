import { Button, Layout, Modal, Popconfirm, Typography } from 'antd';
import { DualTranslate, Translate } from 'components/language';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { Region } from 'pages/Daily/components/Region';
import { useMemo } from 'react';
import { useMeasure } from 'react-use';
import { Me } from 'types/user';
import { getAnimationClass } from 'utils/helpers';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { PHASES, SETTINGS } from '../utils/settings';
import { DailyControleDeEstoqueEntry } from '../utils/types';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { FulfillingPhase } from './FulfillingPhase';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { StockingPhase } from './StockingPhase';

type DailyControleDeEstoqueProps = {
  data: DailyControleDeEstoqueEntry;
  currentUser: Me;
};

export function DailyControleDeEstoque({ data }: DailyControleDeEstoqueProps) {
  const {
    hearts,
    warehouse,
    currentGood,
    activeOrder,
    lastPlacedGoodId,
    onPlaceGood,
    onSelectOrder,
    onFulfill,
    onTakeBack,
    onSubmit,
    fulfillments,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    guesses,
    reset,
    latestAttempt,
    phase,
    orders,
  } = useControleDeEstoqueEngine(data);
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();

  const shouldShakeScreen = latestAttempt && !isComplete;

  const shelfWidth = useMemo(() => {
    const totalWidth = contentMeasure.width / 5 - 16;
    return Math.min(Math.max(totalWidth, 48), 96);
  }, [contentMeasure.width]);

  return (
    <Layout className="app">
      <Header icon={<DailyWarehouseGameIcon />}>
        <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={contentRef}>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />

        <div key={latestAttempt} className={shouldShakeScreen ? getAnimationClass('shakeX') : ''}>
          <Region>
            <Typography.Text strong className="controle-de-estoque-title">
              {data.title}
            </Typography.Text>
          </Region>

          {phase === PHASES.STOCKING && currentGood && (
            <StockingPhase
              warehouse={warehouse}
              currentGood={currentGood}
              lastPlacedGoodId={lastPlacedGoodId}
              onPlaceGood={onPlaceGood}
              shelfWidth={shelfWidth}
            />
          )}

          {phase !== PHASES.STOCKING && (
            <FulfillingPhase
              phase={phase}
              warehouse={warehouse}
              orders={orders}
              activeOrder={activeOrder}
              fulfillments={fulfillments}
              shelfWidth={shelfWidth}
              onSelectOrder={onSelectOrder}
              onFulfill={onFulfill}
              onTakeBack={onTakeBack}
              onSubmit={onSubmit}
              isComplete={isComplete}
              setShowResultModal={setShowResultModal}
            />
          )}
        </div>

        <Modal
          title={<Translate pt="Resultado" en="Results" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          <ResultsModalContent
            challenge={data?.number}
            isWin={isWin}
            hearts={hearts}
            guesses={guesses}
            title={data.title}
          />
        </Modal>
      </Layout.Content>

      <Region>
        <Popconfirm
          title={<Translate pt="Deseja mesmo recomeçar o jogo?" en="Do you really want to reset the game?" />}
          onConfirm={reset}
        >
          <Button type="primary" danger>
            <Translate pt="Recomeçar Jogo" en="Reset Game" />
          </Button>
        </Popconfirm>
      </Region>
    </Layout>
  );
}
