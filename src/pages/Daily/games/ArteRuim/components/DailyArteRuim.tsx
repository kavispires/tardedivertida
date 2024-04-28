import { Button, Layout, Modal, Space } from 'antd';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { CalendarIcon } from 'icons/CalendarIcon';
import { Keyboard } from 'pages/Daily/components/Keyboard';
import { useDailyChallengeMutation } from 'pages/Daily/hooks/useDailyChallengeMutation';
import { useDailyLocalStorage } from 'pages/Daily/hooks/useDailyLocalStorage';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { useEffect, useMemo, useState } from 'react';
import { Me } from 'types/user';
import { removeDuplicates } from 'utils/helpers';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { getSourceName } from '../../../utils';
import { getLettersInWord } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import { ArteRuimLocalToday, DailyArteRuimEntry } from '../utils/types';
import { DrawingCarousel } from './DrawingCarousel';
import { Prompt } from './Prompt';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyArteRuimProps = {
  data: DailyArteRuimEntry;
  currentUser: Me;
};

export function DailyArteRuim({ data }: DailyArteRuimProps) {
  const { language } = useLanguage();
  const source = getSourceName(language);

  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(SETTINGS.HEARTS);
  const [guessedLetters, setGuessedLetters] = useState<BooleanDictionary>({});
  const [correctLetters, setCorrectLetters] = useState<BooleanDictionary>(getLettersInWord(data.text));
  const [showResultModal, setShowResultModal] = useState(false);

  const isComplete = Object.values(correctLetters).every(Boolean);

  const { localToday, updateLocalStorage } = useDailyLocalStorage(source, data);
  const latestToday: ArteRuimLocalToday | null = localToday && localToday.id === data.id ? localToday : null;

  const dailyMutation = useDailyChallengeMutation();

  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (guessedLetters[letter]) {
      return;
    }
    // Add to the guessed letters
    setGuessedLetters((prev) => ({ ...prev, [letter]: true }));

    if (localToday) {
      updateLocalStorage({
        ...(localToday ?? {}),
        letters: removeDuplicates([...(localToday.letters ?? {}), letter]),
      });
    }

    // If it is a correct letter, make it true
    if (correctLetters[letter] !== undefined) {
      setCorrectLetters((prev) => ({ ...prev, [letter]: true }));
    } else {
      // Otherwise, lose a heart
      setHearts((prev) => prev - 1);
    }

    if (isComplete || hearts <= 0) {
      // TODO: Save NOT WORKING, race condition
      // dailyMutation.mutate({
      //   id: daily.id,
      //   number: daily.number,
      //   victory: isComplete,
      //   hearts,
      //   letters: Object.keys(guessedLetters),
      // });
    }
  };

  // If already play, show winning screen
  useEffect(() => {
    if (latestToday && latestToday.id === data.id) {
      latestToday!.letters.forEach((letter: string) => {
        guessLetter(letter);
      });
    } else {
      // Save to local storage
      updateLocalStorage({
        id: data.id,
        number: data.number,
        victory: isComplete,
        hearts,
        letters: Object.keys(guessedLetters),
      });
    }
  }, [latestToday]); // eslint-disable-line react-hooks/exhaustive-deps

  // Controls auto result modal
  useEffect(() => {
    if (isComplete || hearts <= 0) {
      setShowResultModal(true);
    }
  }, [isComplete, hearts, dailyMutation.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={!latestToday} rules={<Rules />} />

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
