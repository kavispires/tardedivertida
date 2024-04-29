import { Button, Layout, Modal, Space } from 'antd';
import { Translate } from 'components/language';

import { CalendarIcon } from 'icons/CalendarIcon';
import { Keyboard } from 'pages/Daily/components/Keyboard';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { useEffect, useMemo, useState } from 'react';
import { Me } from 'types/user';
import { removeDuplicates } from 'utils/helpers';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';

import { getLettersInWord } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import { ArteRuimLocalToday, DailyArteRuimEntry } from '../utils/types';
import { DrawingCarousel } from './DrawingCarousel';
import { Prompt } from './Prompt';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';

type DailyArteRuimProps = {
  data: DailyArteRuimEntry;
  currentUser: Me;
};

const defaultArteRuimLocalToday: ArteRuimLocalToday = {
  hearts: SETTINGS.HEARTS,
  id: '',
  letters: [],
  number: 0,
  victory: false,
};

export function DailyArteRuim({ data }: DailyArteRuimProps) {
  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(SETTINGS.HEARTS);
  const [guessedLetters, setGuessedLetters] = useState<BooleanDictionary>({});
  const [correctLetters, setCorrectLetters] = useState<BooleanDictionary>(getLettersInWord(data.text));
  const [showResultModal, setShowResultModal] = useState(false);

  // const { localToday, updateLocalStorage } = useDailyLocalStorageLegacy(source, data);
  const { localToday, updateLocalStorage, stateToApply } = useDailyLocalToday<ArteRuimLocalToday>({
    key: SETTINGS.TD_DAILY_ARTE_RUIM_LOCAL_TODAY,
    gameId: data.id,
    defaultValue: defaultArteRuimLocalToday,
  });

  const isComplete = Object.values(correctLetters).every(Boolean);

  console.log(localToday);
  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (guessedLetters[letter]) {
      return;
    }
    // Add to the guessed letters
    setGuessedLetters((prev) => ({ ...prev, [letter]: true }));

    updateLocalStorage({
      ...(localToday ?? {}),
      letters: removeDuplicates([...(localToday?.letters ?? []), letter]),
    });

    // If it is a correct letter, make it true
    if (correctLetters[letter] !== undefined) {
      setCorrectLetters((prev) => ({ ...prev, [letter]: true }));
    } else {
      // Otherwise, lose a heart
      setHearts((prev) => prev - 1);
    }
  };

  // If already play, show winning screen
  useEffect(() => {
    if (stateToApply) {
      stateToApply!.letters.forEach((letter: string) => {
        guessLetter(letter);
      });
    }
  }, [stateToApply]); // eslint-disable-line react-hooks/exhaustive-deps

  // Controls auto result modal
  useEffect(() => {
    if (isComplete || hearts <= 0) {
      setShowResultModal(true);
    }
  }, [isComplete, hearts]); // eslint-disable-line react-hooks/exhaustive-deps

  const lettersState = useMemo(() => {
    const state: LettersDictionary = {};
    for (const letter in guessedLetters) {
      state[letter] = correctLetters[letter] ? 'correct' : 'incorrect';
    }
    return state;
  }, [guessedLetters, correctLetters]);

  return (
    <Layout className="app">
      <Header icon={<CalendarIcon />}>
        TD <Translate pt="Diário" en="Daily" /> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!stateToApply?.letters.length}
          rules={<Rules />}
        />

        <DrawingCarousel drawings={data.drawings} />

        <Prompt text={data.text} correctLetters={correctLetters} />

        {(isComplete || hearts <= 0) && (
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
            challenge={data.number}
            win={isComplete}
            hearts={hearts}
            text={data.text}
            correctLetters={correctLetters}
          />
        </Modal>

        <Keyboard
          lettersState={lettersState}
          onLetterClick={guessLetter}
          disabled={hearts <= 0 || isComplete}
        />
      </Layout.Content>
    </Layout>
  );
}
