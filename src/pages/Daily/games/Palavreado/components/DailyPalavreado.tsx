import { App, Button, Layout, Modal, Space } from 'antd';
import clsx from 'clsx';
import { Translate } from 'components/language';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Keyboard } from 'pages/Daily/components/Keyboard';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { useEffect, useState } from 'react';
import { Me } from 'types/user';
import { getAnimationClass, stringRemoveAccents } from 'utils/helpers';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { generateGrid } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import { DailyPalavreadoEntry, Letter } from '../utils/type';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyPalavreadoProps = {
  data: DailyPalavreadoEntry;
  currentUser: Me;
  wordDictionary: StringDictionary;
};

export function DailyPalavreado({ data, wordDictionary }: DailyPalavreadoProps) {
  const { message } = App.useApp();

  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(SETTINGS.HEARTS);
  const [attempts, setAttempts] = useState<Letter[][]>(generateGrid());
  const [win, setWin] = useState<boolean>(false);
  const [row, setRow] = useState<number>(0);
  const [col, setCol] = useState<number>(0);
  const [lettersState, setLettersState] = useState<LettersDictionary>({});
  const [showResultModal, setShowResultModal] = useState(false);

  const clearRow = () => {
    const newAttempts = [...attempts];
    newAttempts[row].fill({ letter: '', state: 'idle' });
    setAttempts(newAttempts);
    setCol(0);
  };

  const onLetterClick = (letter: string) => {
    if (col < 5) {
      const newAttempts = [...attempts];
      newAttempts[row][col] = { letter, state: 'idle' };
      setAttempts(newAttempts);
      setCol((prevCol) => prevCol + 1);
    }
  };

  const onBackspaceClick = () => {
    if (col > 0) {
      const newAttempts = [...attempts];
      newAttempts[row][col - 1] = { letter: '', state: 'idle' };
      setAttempts(newAttempts);
      setCol((prevCol) => prevCol - 1);
    }
  };

  const onEnterClick = () => {
    if (col < 5) {
      message.info(
        <Translate pt="Palavra incompleta, limpando a linha" en="Incomplete word, clearing the row" />
      );
      return clearRow();
    }
    const newAttempts = [...attempts];
    const currentRow = newAttempts[row];
    const suggestedWord = currentRow.map((letter) => letter.letter).join('');
    const cleanWord = stringRemoveAccents(data.text).toLowerCase();

    if (!wordDictionary[suggestedWord] && suggestedWord !== cleanWord) {
      message.info(
        <Translate
          pt={`Essa palavra "${suggestedWord}" não existe na lista do jogo`}
          en={`This word "${suggestedWord}" does not exist in the game list`}
        />
      );
      return;
    }

    const updatedLettersState = { ...lettersState };
    currentRow.forEach((entry, i) => {
      currentRow[i] = { ...entry, state: cleanWord.includes(entry.letter) ? 'intermediate' : 'used' };

      if (entry.letter === cleanWord[i]) {
        currentRow[i] = { ...entry, state: 'correct' };
      }

      updatedLettersState[entry.letter] = currentRow[i].state;
    });

    const isComplete = currentRow.every((entry) => entry.state === 'correct');

    if (!isComplete) {
      setHearts((prev) => prev - 1);
      setRow((prevRow) => prevRow + 1);
    } else {
      setWin(true);
    }

    setCol(0);
    setAttempts(newAttempts);
    setLettersState(updatedLettersState);
  };

  // Controls auto result modal
  useEffect(() => {
    if (win || hearts <= 0) {
      setShowResultModal(true);
    }
  }, [win, hearts]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout className="app">
      <Header icon={<DailyWordGameIcon />}>
        TD <Translate pt="Diário" en="Daily" /> #{data.number}
      </Header>
      <Layout.Content>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={false} rules={<Rules />} />

        <div className="board">
          {attempts.map((attemptRow, i) => (
            <div key={i} className="board__row">
              {attemptRow.map((letter, j) => (
                <div
                  key={j}
                  className={clsx(
                    'board__cell',
                    row === i && `board__cell--active`,
                    `board__cell--${letter.state}`,
                    letter.state !== 'idle' && getAnimationClass('flipInY', { delay: j })
                  )}
                >
                  <span>{letter.letter}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {(win || hearts <= 0) && (
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
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
            win={win}
            hearts={hearts}
            text={data.text}
            attempts={attempts}
          />
        </Modal>

        <Keyboard
          onLetterClick={onLetterClick}
          onBackspaceClick={onBackspaceClick}
          onEnterClick={onEnterClick}
          lettersState={lettersState}
          disabled={win || hearts === 0}
        />
      </Layout.Content>
    </Layout>
  );
}
