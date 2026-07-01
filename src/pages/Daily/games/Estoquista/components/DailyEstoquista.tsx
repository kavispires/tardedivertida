import { useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
// Ant Design Resources
import { UndoOutlined } from '@ant-design/icons';
import { Button, Divider, Layout, Modal, Tooltip, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Components
import { Popconfirm } from '@components/general/Popconfirm';
import { Translate } from '@components/language/Translate';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { Region } from '@pages/Daily/components/Region';
// Internal
import { getInitialState } from '../utils/helpers';
import { PHASES, SETTINGS } from '../utils/settings';
import type { DailyEstoquistaEntry } from '../utils/types';
import { useEstoquistaEngine } from '../utils/useEstoquistaEngine';
import { FulfillingPhase } from './FulfillingPhase';
import { PreloadItems } from './PreloadItems';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { StockingPhase } from './StockingPhase';

type DailyEstoquistaProps = {
  data: DailyEstoquistaEntry;
  currentUser: Me;
};

export function DailyEstoquista({ data }: DailyEstoquistaProps) {
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
  } = useEstoquistaEngine(data, initialState);
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();

  const shelfWidth = useMemo(() => {
    const totalWidth = contentMeasure.width / 5 - 16;
    return Math.min(Math.max(totalWidth, 48), 96);
  }, [contentMeasure.width]);

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <Menu
        hearts={hearts}
        total={SETTINGS.HEARTS}
        openRules={true}
        rules={<Rules date={data.id} />}
      />
      <DailyContent ref={contentRef}>
        <PreloadItems goods={data.goods} />

        <Region>
          <Typography.Text
            strong
            className="controle-de-estoque-title"
          >
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

        <Region
          orientation="horizontal"
          separator={<Divider orientation="vertical" />}
        >
          {evaluations.map((attempt, index) => (
            <Tooltip
              key={`${attempt}-${index}`}
              title={
                <Translate
                  pt="Acertos"
                  en="Correct"
                />
              }
            >
              <span>{attempt.filter(Boolean).length} 📫</span>
            </Tooltip>
          ))}
        </Region>

        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data.number}
            isWin={isWin}
            hearts={hearts}
            evaluations={evaluations}
            title={data.title}
          />
        </Modal>

        <Region>
          <Popconfirm
            title={
              <Translate
                pt="Deseja mesmo recomeçar o jogo?"
                en="Do you really want to reset the game?"
              />
            }
            description={
              <Translate
                pt="Você perderá um coração."
                en="You will lose a heart."
              />
            }
            onConfirm={reset}
          >
            <Button
              type="primary"
              danger
              disabled={hearts <= 0}
              icon={<UndoOutlined />}
            >
              <Translate
                pt="Recomeçar Jogo"
                en="Reset Game"
              />
            </Button>
          </Popconfirm>
        </Region>
      </DailyContent>
    </Layout>
  );
}
