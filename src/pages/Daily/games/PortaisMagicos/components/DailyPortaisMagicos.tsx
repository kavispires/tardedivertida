import { Region, TextRegion } from 'pages/Daily/components/Region';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { BarChartOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Space } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
// Icons
import { DailyImagesGameIcon } from 'icons/DailyImagesGameIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPortaisMagicosEntry } from '../utils/types';
import { usePortaisMagicosEngine } from '../utils/usePortaisMagicosEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Passcode } from './Passcode';
import { Corridor } from './Corridor';

type DailyPortaisMagicosProps = {
  data: DailyPortaisMagicosEntry;
  currentUser: Me;
};

export function DailyPortaisMagicos({ data }: DailyPortaisMagicosProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    currentCorridorIndex,
    currentCorridorIndexes,
    currentCorridor,
    guesses,
    moves,
    onSlideWordPosition,
    onSubmitPasscode,
  } = usePortaisMagicosEngine(data, initialState);
  const [width, ref] = useCardWidthByContainerRef(3, { margin: 24, gap: 12, maxWidth: 250, minWidth: 55 });

  const latestGuess = guesses[currentCorridorIndex][guesses[currentCorridorIndex].length - 1];

  // biome-ignore lint/correctness/useExhaustiveDependencies: word length is not a dependency
  const currentGuess = useMemo(() => {
    const wordsLength = data.corridors[currentCorridorIndex].words[0].length;

    return currentCorridorIndexes
      .map((pos, index) => data.corridors[currentCorridorIndex].words[index][wordsLength - 1 - pos])
      .join('');
  }, [currentCorridorIndex, currentCorridorIndexes]);

  return (
    <Layout className="app">
      <Header icon={<DailyImagesGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={ref}>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules />}
        />

        {currentCorridor && !isComplete && (
          <>
            <Region key={`doors-${currentCorridor?.passcode}`}>
              <Corridor
                number={currentCorridorIndex + 1}
                imagesIds={currentCorridor.imagesIds}
                width={width}
                moves={moves}
              />
            </Region>

            <TextRegion>
              <Instruction contained noMargin>
                <Translate
                  en="Arrange the words vertically to form the passcode"
                  pt="Organize as palavras verticalmente para formar a palavra-chave"
                />
              </Instruction>
            </TextRegion>

            <Region key={`passcode-${currentCorridor?.passcode}`}>
              <Passcode
                passcode={currentCorridor.passcode}
                latestGuess={latestGuess}
                words={currentCorridor.words}
                currentCorridorIndexes={currentCorridorIndexes}
                onSlideWordPosition={onSlideWordPosition}
                disabled={isLose}
              />
            </Region>

            <Region>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onSubmitPasscode}
                disabled={currentGuess === latestGuess || isLose}
                className="mt-4"
              >
                <Translate pt="Enviar palavra-chave" en="Send passcode" />
              </Button>
            </Region>
          </>
        )}

        {isComplete &&
          data.corridors.map((corridor, index) => {
            return (
              <Region key={corridor.passcode}>
                <Corridor
                  number={index + 1}
                  imagesIds={corridor.imagesIds}
                  width={width * 0.75}
                  passcode={corridor.passcode}
                  moves={moves}
                />
              </Region>
            );
          })}

        {isComplete && (
          <Space className="results-container" direction="vertical" align="center" size="large">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challenge={data.number}
            win={isWin}
            corridors={data.corridors}
            guesses={guesses}
            currentCorridorIndex={currentCorridorIndex}
            moves={moves}
            hearts={hearts}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
