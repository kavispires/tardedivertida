import { DndContext } from '@dnd-kit/core';
import { motion } from 'motion/react';
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { Region } from 'pages/Daily/components/Region';
import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useTDImageCardUrl } from 'hooks/useTDImageCardUrl';
// Icons
import { DailyPuzzleGameIcon } from 'icons/DailyPuzzleGameIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyVitraisEntry } from '../utils/types';
import { useVitraisEngine } from '../utils/useVitraisEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { DraggablePiece } from './DraggablePiece';

type DailyVitraisProps = {
  data: DailyVitraisEntry;
  currentUser: Me;
};

export function DailyVitrais({ data }: DailyVitraisProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    time,
    handleDragEnd,
    piecesState,
    lockedPieces,
    blockSize,
    sensors,
    containerRef,
    boardOffset,
    score,
    totalTime,
  } = useVitraisEngine(data, initialState);
  const imageUrl = useTDImageCardUrl(data.cardId);

  const boardPixelHeight = data.gridRows * blockSize;
  const boardPixelWidth = data.gridCols * blockSize;

  const [width, ref] = useCardWidthByContainerRef(1, { margin: 72, gap: 0, maxWidth: 512, minWidth: 256 });

  return (
    <Layout className="app">
      <Header icon={<DailyPuzzleGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <DailyContent ref={ref}>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules date={data.id} />}
        />

        <Region>
          <Typography.Text className="center">{data.title}</Typography.Text>
          <Typography.Text className="center">
            {lockedPieces.length}/{data.pieces.length} - {time} - {score} pts
          </Typography.Text>
        </Region>

        {isComplete && (
          <Space className="results-container" orientation="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <Region className="full-width">
            <div
              className="vitrais-dnd-area"
              ref={containerRef}
              style={{
                width,
                height: width * 2,
              }}
            >
              {blockSize > 0 && (
                <>
                  <motion.div
                    className="vitrais-board-guide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      top: boardOffset.y,
                      left: boardOffset.x,
                      width: boardPixelWidth,
                      height: boardPixelHeight,
                    }}
                  >
                    <div
                      className="vitrais-board-grid"
                      style={{
                        backgroundSize: `${blockSize}px ${blockSize}px`,
                      }}
                    />
                  </motion.div>

                  {/* Pieces */}
                  {data.pieces.map((piece) => {
                    const state = piecesState[piece.id];
                    if (!state) return null; // Should not happen if ready

                    return (
                      <DraggablePiece
                        key={piece.id}
                        pieceData={piece}
                        pieceState={state}
                        imageUrl={imageUrl}
                        totalCols={data.gridCols}
                        totalRows={data.gridRows}
                        blockSize={blockSize}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </Region>
        </DndContext>

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            hearts={hearts}
            totalTime={totalTime}
            score={score}
            title={data.title}
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
