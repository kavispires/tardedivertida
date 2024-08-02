import { Button, Layout, Modal, Popconfirm, Typography } from 'antd';
import { DualTranslate, Translate } from 'components/language';
import { Me } from 'types/user';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyControleDeEstoqueEntry } from '../utils/types';

import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { useMeasure } from 'react-use';
import { useMemo } from 'react';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { StockingPhase } from './StockingPhase';
import { FulfillingPhase } from './FulfillingPhase';
import { Region } from 'pages/Daily/components/Region';
import { getAnimationClass } from 'utils/helpers';

type DailyControleDeEstoqueProps = {
  data: DailyControleDeEstoqueEntry;
  currentUser: Me;
};

export function DailyControleDeEstoque({ data }: DailyControleDeEstoqueProps) {
  const {
    hearts,
    warehouse,
    currentGood,
    currentOrder,
    lastPlacedGoodId,
    onDeliver,
    onBack,
    onSubmit,
    fulfillments,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    onPlaceGood,
    guesses,
    reset,
    latestAttempt,
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

          {currentGood && (
            <StockingPhase
              warehouse={warehouse}
              currentGood={currentGood}
              lastPlacedGoodId={lastPlacedGoodId}
              onPlaceGood={onPlaceGood}
              shelfWidth={shelfWidth}
            />
          )}

          {!currentGood && (
            <FulfillingPhase
              warehouse={warehouse}
              currentOrder={currentOrder}
              fulfillments={fulfillments}
              shelfWidth={shelfWidth}
              onDeliver={onDeliver}
              onBack={onBack}
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
