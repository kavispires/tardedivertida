import { DndContext, PointerSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { DailyItem } from '@pages/Daily/components/DailyItem';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { Region } from '@pages/Daily/components/Region';
import { ShowResultsButton } from '@pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyAlienadoEntry } from '../utils/types';
import { useAlienadoEngine } from '../utils/useAlienadoEngine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { RulesHints } from './RulesHints';
import { AlienDictionary } from './AlienDictionary';
import { Board } from './Board';

type DailyAlienadoProps = {
  data: DailyAlienadoEntry;
  currentUser: Me;
};

export function DailyAlienado({ data }: DailyAlienadoProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    selection,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onItemClick,
    onSlotClick,
    slotIndex,
    isReady,
    submitGuess,
    latestAttempt,
    guesses,
    handleDragEnd,
  } = useAlienadoEngine(data, initialState);
  const width = useCardWidth(7, { margin: 64, maxWidth: 75, minWidth: 55 });

  const shouldShakeScreen = Boolean(latestAttempt && !isComplete);
  const previousGuesses = useMemo(() => guesses.map((guess) => guess.split('-')), [guesses]);

  // Set up sensors: Only drag after moving 5 pixels, allowing clicks to pass cleanly
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <Menu
        hearts={hearts}
        total={SETTINGS.HEARTS}
        openRules={!isComplete || hearts === SETTINGS.HEARTS}
        rules={<Rules date={data.id} />}
      />
      <DailyContent>
        {/* Wrap the playable area in DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
        >
          <AlienDictionary
            attributes={data.attributes}
            width={width}
          />

          <ShowResultsButton
            isComplete={isComplete}
            setShowResultModal={setShowResultModal}
          />

          <Board
            latestAttempt={latestAttempt}
            shouldShakeScreen={shouldShakeScreen}
            selection={selection}
            onItemClick={onItemClick}
            onSlotClick={onSlotClick}
            slotIndex={slotIndex}
            isComplete={isComplete}
            isLose={isLose}
            width={width}
            data={data}
            previousGuesses={previousGuesses}
            isReady={isReady}
            submitGuess={submitGuess}
          />
        </DndContext>

        {!isComplete && previousGuesses.length > 0 && (
          <Region>
            <Typography.Text strong>
              <Translate
                pt="Tentativas anteriores"
                en="Previous Guesses:"
              />
            </Typography.Text>
            <Space
              orientation="vertical"
              className="previous-guesses"
            >
              {previousGuesses.map((guess) => (
                <Space key={String(guess)}>
                  {guess.map((itemId) => (
                    <DailyItem
                      key={itemId}
                      itemId={itemId}
                      width={Math.max(width / 2, 40)}
                      padding={0}
                      className="alien-requests__previous-item"
                    />
                  ))}
                </Space>
              ))}
            </Space>
          </Region>
        )}

        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            guesses={guesses}
            hearts={hearts}
            attributes={data.attributes}
            requests={data.requests}
            solution={data.solution}
            width={width * 0.65}
          />
        </Modal>
        <Region>
          <RulesHints />
        </Region>
      </DailyContent>
    </Layout>
  );
}
