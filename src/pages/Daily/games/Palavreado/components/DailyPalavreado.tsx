import { Button, Divider, Flex, Layout, Modal, Space, Typography } from 'antd';
import { DualTranslate, Translate } from 'components/language';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Me } from 'types/user';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyPalavreadoEntry } from '../utils/types';
import { usePalavreadoEngine } from '../utils/usePalavreadoEngine';
import { Board } from './Board';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Region, TextRegion } from 'pages/Daily/components/Region';

type DailyPalavreadoProps = {
  data: DailyPalavreadoEntry;
  currentUser: Me;
};

export function DailyPalavreado({ data }: DailyPalavreadoProps) {
  const {
    hearts,
    selection,
    guesses,
    letters,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitGrid,
    swap,
    swaps,
  } = usePalavreadoEngine(data);

  return (
    <Layout className="app">
      <Header icon={<DailyWordGameIcon />}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />

        <Region>
          <Typography.Text strong className="palavreado-word">
            {data.keyword} {swaps > 0 && ` ↔️ ${swaps}`}
          </Typography.Text>
          <Board
            letters={letters}
            onLetterSelection={selectLetter}
            selection={selection}
            swap={swap}
            guesses={guesses}
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

        <TextRegion>
          {guesses.map((attempt, index) => (
            <Space key={`${attempt}-${index}`} split={<Divider type="vertical" />}>
              {attempt.map((word, i) => (
                <span className="palavreado-word" key={`${attempt}-${index}-${word}-${i}`}>
                  {word}
                </span>
              ))}
            </Space>
          ))}
        </TextRegion>

        {guesses.length > 0 && (
          <TextRegion>
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
          </TextRegion>
        )}
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
            isLose={isLose}
            hearts={hearts}
            words={data.words}
            letters={letters}
            swaps={swaps}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
