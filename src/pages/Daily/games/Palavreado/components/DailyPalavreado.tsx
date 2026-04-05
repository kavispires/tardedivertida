import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { BulbOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Layout, Modal, Popconfirm, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Icons
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
// Components
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { Header } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';
import { Region } from 'pages/Daily/components/Region';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
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
  } = usePalavreadoEngine(data, initialState);

  return (
    <Layout>
      <Header
        icon={<DailyWordGameIcon />}
        localStorageKey={SETTINGS.KEY}
      >
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
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
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
