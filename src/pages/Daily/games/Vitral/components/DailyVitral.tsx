import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useState } from 'react';
// Ant Design Resources
import { Layout, Modal, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useTDImageCardUrl } from 'hooks/useTDImageCardUrl';
// Icons
import { ClockIcon } from 'icons/ClockIcon';
import { PuzzleIcon } from 'icons/PuzzleIcon';
import { VictoryCoinIcon } from 'icons/VictoryCoinIcon';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { GameHeader } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';
import { Region } from 'pages/Daily/components/Region';
import { RegionStats } from 'pages/Daily/components/RegionStats';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyVitralEntry } from '../utils/types';
import { useVitralEngine } from '../utils/useVitralEngine';
import { COLS, getPieceStyle } from '../utils/puzzleUtils';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { DraggablePiece } from './DraggablePiece';
import { GridSlot } from './GridSlot';

type DailyVitralProps = {
  data: DailyVitralEntry;
  currentUser: Me;
};

export function DailyVitral({ data }: DailyVitralProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    time,
    handleDragStart,
    handleDragEnd,
    sensors,
    containerRef,
    measures,
    score,
    totalTime,
    justDroppedIds,
    activeDrag,
    allPieceIds,
    grid,
    getBorders,
    correctPieces,
  } = useVitralEngine(data, initialState);
  const imageUrl = useTDImageCardUrl(data.cardId);

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <DailyContent ref={containerRef}>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={
            <Rules
              date={data.id}
              numberOfPieces={data.pieces.length}
            />
          }
        />

        <Region>
          <Typography.Text className="center">{data.title}</Typography.Text>
          <RegionStats
            stats={[
              {
                key: 'completionRate',
                label: `${correctPieces}/${data.pieces.length}`,
                icon: <PuzzleIcon />,
                tooltip: {
                  pt: 'Peças corretas',
                  en: 'Correct pieces',
                },
              },
              {
                key: 'time',
                label: time,
                icon: <ClockIcon />,
                tooltip: {
                  pt: 'Tempo decorrido',
                  en: 'Elapsed Time',
                },
              },
              {
                key: 'score',
                label: score,
                icon: <VictoryCoinIcon />,
                tooltip: {
                  pt: 'Pontuação',
                  en: 'Score',
                },
              },
            ]}
          />
        </Region>

        <ShowResultsButton
          isComplete={isComplete}
          setShowResultModal={setShowResultModal}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: measures.width,
            margin: '12px auto',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: measures.width,
              height: measures.height,
              backgroundColor: '#1f1f1f',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              border: isComplete ? '2px solid #4ade80' : 'none',
              transition: 'border 0.3s ease',
            }}
          >
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div
                style={{
                  display: 'grid',
                  width: '100%',
                  height: '100%',
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${measures.rows}, 1fr)`,
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                }}
              >
                {Array.from({ length: measures.totalSlots }).map((_, index) => (
                  <GridSlot
                    key={index}
                    index={index}
                  />
                ))}
              </div>

              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
                {allPieceIds.map((pieceId) => {
                  const currentSlotIndex = grid.findIndex((p) => p?.id === pieceId);

                  if (currentSlotIndex === -1) return null;

                  let isHidden = false;
                  if (activeDrag) {
                    const offset = currentSlotIndex - activeDrag.originIndex;
                    if (activeDrag.groupIndices.includes(offset)) {
                      isHidden = true;
                    }
                  }

                  const borders = getBorders(currentSlotIndex, grid);
                  const isJustDropped = justDroppedIds.includes(pieceId);

                  return (
                    <DraggablePiece
                      key={pieceId}
                      pieceId={pieceId}
                      currentSlotIndex={currentSlotIndex}
                      totalRows={measures.rows}
                      imageUrl={imageUrl}
                      isHidden={isHidden}
                      disabled={isComplete}
                      borders={borders}
                      isJustDropped={isJustDropped}
                    />
                  );
                })}
              </div>

              <DragOverlay dropAnimation={null}>
                {activeDrag ? (
                  <div
                    style={{ position: 'relative', width: measures.cellWidth, height: measures.cellHeight }}
                  >
                    {activeDrag.groupIndices.map((offset) => {
                      const originalIndex = activeDrag.originIndex + offset;
                      const piece = grid[originalIndex];
                      if (!piece) return null;

                      const colOffset = (originalIndex % COLS) - (activeDrag.originIndex % COLS);
                      const rowOffset =
                        Math.floor(originalIndex / COLS) - Math.floor(activeDrag.originIndex / COLS);

                      const borders = getBorders(originalIndex, grid);

                      return (
                        <div
                          key={piece.id}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: `${colOffset * 100}%`,
                            top: `${rowOffset * 100}%`,
                            zIndex: 999,
                            filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.5))',
                          }}
                        >
                          <div style={getPieceStyle(piece.id, imageUrl, measures.rows)} />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              pointerEvents: 'none',
                              borderTop: borders.top ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                              borderRight: borders.right ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                              borderBottom: borders.bottom ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                              borderLeft: borders.left ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
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
