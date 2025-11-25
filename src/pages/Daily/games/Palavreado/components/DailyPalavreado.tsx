import clsx from 'clsx';
import { Region } from 'pages/Daily/components/Region';
import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Icons
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPalavreadoEntry } from '../utils/types';
import { usePalavreadoEngine } from '../utils/usePalavreadoEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { Board } from './Board';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyPalavreadoProps = {
  data: DailyPalavreadoEntry;
  currentUser: Me;
};

export function DailyPalavreado({ data }: DailyPalavreadoProps) {
  const [initialState] = useState(getInitialState(data));
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
  } = usePalavreadoEngine(data, initialState);

  return (
    <Layout className="app">
      <Header icon={<DailyWordGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={Math.max(SETTINGS.HEARTS, size)}
          openRules={true}
          rules={<Rules date={data.id} />}
        />

        <Region>
          <Typography.Text strong className="palavreado-word">
            {keyword} {swaps > 0 && ` ↔️ ${swaps}`}
          </Typography.Text>
          <Board
            letters={letters}
            onLetterSelection={selectLetter}
            selection={selection}
            swap={swap}
            guesses={guesses}
            size={size}
          />
        </Region>

        <Region>
          {isComplete ? (
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          ) : (
            <Button type="primary" onClick={submitGrid} disabled={isComplete} block>
              <Translate pt="Enviar" en="Submit" />
            </Button>
          )}
        </Region>

        <Region direction="vertical" size="small">
          {guesses.map((attempt, index) => (
            <Space
              key={`${attempt}-${
                // biome-ignore lint/suspicious/noArrayIndexKey: it's fine
                index
              }`}
              separator={<Divider orientation="vertical" className="mx-0" />}
              size="small"
            >
              {attempt.map((word, i) => (
                <Typography.Text
                  keyboard
                  className={clsx('palavreado-word', {
                    [`palavreado-word--${i}`]: word.toLowerCase() === words[i].toLowerCase(),
                  })}
                  key={`${attempt}-${index}-${word}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: it's fine
                    i
                  }`}
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
            <Flex className="contained" gap={12} align="center">
              <div className="palavreado-board__tile palavreado-board__tile--place-guessed palavreado-board__tile--sample">
                ?
              </div>
              <Typography.Text>
                <Translate
                  pt={
                    <>
                      Posições que já foram testadas com a letra específica aparecem assim (borda preta
                      pontilhada).
                      <br />
                      Evite enviar com letras assim, elas continuarão erradas.
                    </>
                  }
                  en={
                    <>
                      Positions that have already been tested with a specific letter appear like this (dotted
                      black border).
                      <br />
                      Avoid submitting with letters like this, they will remain wrong.
                    </>
                  }
                />
              </Typography.Text>
            </Flex>
          </Region>
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challengeNumber={data?.number}
            isWin={isWin}
            hearts={hearts}
            words={data.words}
            swaps={swaps}
            guesses={guesses}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
