import { Region, TextRegion } from 'pages/Daily/components/Region';
import { useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
// Ant Design Resources
import { Button, Divider, Layout, Modal, Popconfirm, Tooltip, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Icons
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
// Internal
import { getInitialState } from '../utils/helpers';
import { PHASES, SETTINGS } from '../utils/settings';
import type { DailyControleDeEstoqueEntry } from '../utils/types';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { FulfillingPhase } from './FulfillingPhase';
import { PreloadItems } from './PreloadItems';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { StockingPhase } from './StockingPhase';

type DailyControleDeEstoqueProps = {
  data: DailyControleDeEstoqueEntry;
  currentUser: Me;
};

export function DailyControleDeEstoque({ data }: DailyControleDeEstoqueProps) {
  const [initialState] = useState(getInitialState(data));

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
    evaluations,
    reset,
    latestAttempt,
    phase,
    orders,
  } = useControleDeEstoqueEngine(data, initialState);
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();

  const shelfWidth = useMemo(() => {
    const totalWidth = contentMeasure.width / 5 - 16;
    return Math.min(Math.max(totalWidth, 48), 96);
  }, [contentMeasure.width]);

  return (
    <Layout className="app">
      <Header icon={<DailyWarehouseGameIcon />} localStorageKey={SETTINGS.KEY}>
        <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={contentRef}>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules date={data.id} />} />

        <PreloadItems goods={data.goods} />

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
            latestAttempt={latestAttempt}
          />
        )}

        <TextRegion direction="horizontal" split={<Divider type="vertical" />}>
          {evaluations.map((attempt, index) => (
            <Tooltip key={`${attempt}-${index}`} title={<Translate pt="Acertos" en="Correct" />}>
              <span>{attempt.filter(Boolean).length} 📫</span>
            </Tooltip>
          ))}
        </TextRegion>

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challenge={data?.number}
            isWin={isWin}
            hearts={hearts}
            evaluations={evaluations}
            title={data.title}
          />
        </Modal>
      </Layout.Content>

      <Region>
        <Popconfirm
          title={<Translate pt="Deseja mesmo recomeçar o jogo?" en="Do you really want to reset the game?" />}
          description={<Translate pt="Você perderá um coração." en="You will lose a heart." />}
          onConfirm={reset}
        >
          <Button type="primary" danger disabled={hearts <= 0}>
            <Translate pt="Recomeçar Jogo" en="Reset Game" />
          </Button>
        </Popconfirm>
      </Region>
    </Layout>
  );
}
