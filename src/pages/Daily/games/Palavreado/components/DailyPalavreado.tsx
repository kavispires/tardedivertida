import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  pointerWithin,
} from '@dnd-kit/core';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { BulbOutlined } from '@ant-design/icons';
import { App, Button, Divider, Flex, Layout, Modal, Popconfirm, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Utils
import { pluralize } from '@utils/helpers';
// Icons
import { SwapIcon } from '@icons/SwapIcon';
import { VictoryCoinIcon } from '@icons/VictoryCoinIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { Region } from '@pages/Daily/components/Region';
import { RegionStats } from '@pages/Daily/components/RegionStats';
import { ShowResultsButton } from '@pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPalavreadoEntry } from '../utils/types';
import { usePalavreadoEngine } from '../utils/usePalavreadoEngine';
import { Board } from './Board';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyPalavreadoProps = {
  data: DailyPalavreadoEntry;
  currentUser: Me;
};

export function DailyPalavreado({ data }: DailyPalavreadoProps) {
  const [initialState] = useState(getInitialState(data));
  const { notification } = App.useApp();
  const {
    hearts,
    selection,
    guesses,
    letters,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    selectLetter,
    submitGrid,
    swap,
    swaps,
    size,
    keyword,
    words,
    smartShuffle,
    usedSmartShuffle,
    swapLetters,
    score,
    latestCorrectLettersCount,
    scoringMessage,
    letterScore,
  } = usePalavreadoEngine(data, initialState);

  /// Tolerance of 5px allows regular clicks to fire instantly.
  // Delay of 150ms means if they press and hold, it lifts up ready to drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = active.data.current?.index;
      const toIndex = over.data.current?.index;

      if (fromIndex !== undefined && toIndex !== undefined && fromIndex !== toIndex) {
        swapLetters(fromIndex, toIndex);
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only score message is important
  useEffect(() => {
    if (letterScore || scoringMessage || latestCorrectLettersCount > 0) {
      notification.warning({
        icon: <Icon icon={<VictoryCoinIcon />} />,
        title:
          latestCorrectLettersCount > 0 ? (
            <Translate
              en={`+ ${letterScore} points for ${latestCorrectLettersCount} ${pluralize(latestCorrectLettersCount, 'correct letter', 'correct letters')}!`}
              pt={`+ ${letterScore} pontos por ${latestCorrectLettersCount} ${pluralize(latestCorrectLettersCount, 'letra correta', 'letras corretas')}!`}
            />
          ) : undefined,
        description: scoringMessage ? scoringMessage : undefined,
        placement: 'bottomLeft',
        role: 'status',
      });
    }
  }, [letterScore, scoringMessage, latestCorrectLettersCount]);

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <Menu
        hearts={hearts}
        total={Math.max(SETTINGS.HEARTS, size)}
        openRules={true}
        rules={<Rules date={data.id} />}
      />
      <DailyContent>
        <Region>
          <Typography.Text
            strong
            className="palavreado-word"
          >
            {keyword}
          </Typography.Text>
          <RegionStats
            stats={[
              {
                key: 'swaps',
                label: swaps,
                icon: <SwapIcon />,
                tooltip: {
                  pt: 'Trocas',
                  en: 'Swaps',
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

        <Region>
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
          >
            <Board
              letters={letters}
              onLetterSelection={selectLetter}
              selection={selection}
              swap={swap}
              guesses={guesses}
              size={size}
            />
          </DndContext>
        </Region>

        <ShowResultsButton
          isComplete={isComplete}
          setShowResultModal={setShowResultModal}
        />

        {!isComplete && (
          <Region>
            <Button
              type="primary"
              onClick={submitGrid}
              disabled={isComplete}
              block
              size="large"
            >
              <Translate
                pt="Enviar"
                en="Submit"
              />
            </Button>
          </Region>
        )}

        <Region
          orientation="vertical"
          size="small"
        >
          {guesses.map((attempt, index) => (
            <Space
              key={`${attempt}-${index}`}
              separator={
                <Divider
                  orientation="vertical"
                  className="mx-0"
                />
              }
              size="small"
            >
              {attempt.map((word, i) => (
                <Typography.Text
                  keyboard
                  className={clsx('palavreado-word', {
                    [`palavreado-word--${i}`]: word.toLowerCase() === words[i].toLowerCase(),
                  })}
                  key={`${attempt}-${index}-${word}-${i}`}
                  // style={word.toLowerCase() === words[i].toLowerCase() ? { color: 'gold' } : {}}
                >
                  {word}
                </Typography.Text>
              ))}
            </Space>
          ))}
        </Region>

        {guesses.length > 0 && (
          <Region>
            <Flex
              className="contained"
              gap={12}
              align="center"
            >
              <div className="palavreado-board__tile palavreado-board__tile--place-guessed palavreado-board__tile--sample">
                ?
              </div>
              <Typography.Text>
                <Translate
                  en="Positions that have already been tested with a specific letter appear like this (dotted black border).<br/>Avoid submitting with letters like this, they will remain wrong."
                  pt="Posições que já foram testadas com a letra específica aparecem assim (borda preta pontilhada).<br/>Evite enviar com letras assim, elas continuarão erradas."
                />
              </Typography.Text>
            </Flex>
          </Region>
        )}

        {!isComplete && (
          <Region className="mt-5">
            <Popconfirm
              title={
                <Translate
                  pt="Você só pode usar esta dica uma vez!"
                  en="You can only use this hint once!"
                />
              }
              description={
                <Translate
                  pt="Isso embaralhará as letras incorretas de forma inteligente. Vogais trocam com vogais, consoantes com consoantes, e posições já testadas serão evitadas."
                  en="This will intelligently shuffle incorrect letters. Vowels swap with vowels, consonants with consonants, and previously tested positions are avoided."
                />
              }
              onConfirm={smartShuffle}
              okText={
                <Translate
                  pt="Embaralhar"
                  en="Shuffle"
                />
              }
              cancelText={
                <Translate
                  pt="Cancelar"
                  en="Cancel"
                />
              }
              disabled={
                isComplete || hearts <= 1 || hearts === Math.max(SETTINGS.HEARTS, size) || usedSmartShuffle
              }
            >
              <Button
                icon={<BulbOutlined />}
                disabled={
                  isComplete || hearts <= 1 || hearts === Math.max(SETTINGS.HEARTS, size) || usedSmartShuffle
                }
                color="gold"
                variant="solid"
              >
                <Translate
                  pt="Embaralhar Inteligente"
                  en="Smart Shuffle"
                />
              </Button>
            </Popconfirm>
            {!usedSmartShuffle && (
              <Typography.Text type="secondary">
                <Translate
                  pt="Você só pode usar o Embaralhar inteligente uma vez e só depois da primeira tentativa e antes da última!"
                  en="You can only use the Smart Shuffle once and after the first attempt and before the last!"
                />
              </Typography.Text>
            )}
          </Region>
        )}

        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data?.number}
            isWin={isWin}
            hearts={hearts}
            words={data.words}
            swaps={swaps}
            guesses={guesses}
            usedSmartShuffle={usedSmartShuffle}
            score={score}
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
