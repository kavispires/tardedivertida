import { Button, Layout, Modal, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { CalendarIcon } from 'icons/CalendarIcon';
import { useEffect, useState } from 'react';
import { removeDuplicates } from 'utils/helpers';

import { ArteRuimLocalToday, DailyArteRuimEntry } from '../../types';
import { useDailyChallengeMutation } from '../../useDaily';
import { getLettersInWord, getSourceName } from '../../utils';
import { DrawingCarousel } from './DrawingCarousel';
import { Keyboard } from './Keyboard';
import { Menu } from './Menu';
import { Prompt } from './Prompt';
import { ResultsModalContent } from './ResultsModalContent';

const { Header, Content } = Layout;

type DailyGameProps = {
  data: DailyArteRuimEntry;
  currentUser: Me;
  language: Language;
};

export function DailyArteRuimGame({ data, currentUser, language }: DailyGameProps) {
  const [getLocalProperty, setLocalProperty] = useLocalStorage();

  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(3);
  const [guessedLetters, setGuessedLetters] = useState<BooleanDictionary>({});
  const [correctLetters, setCorrectLetters] = useState<BooleanDictionary>(getLettersInWord(data.text));
  const [showResultModal, setShowResultModal] = useState(false);

  const isComplete = Object.values(correctLetters).every(Boolean);
  const source = getSourceName(language);

  const localToday = getLocalProperty(source);
  const latestToday: ArteRuimLocalToday | null = localToday && localToday.id === data.id ? localToday : null;

  const dailyMutation = useDailyChallengeMutation();

  const updateLocalStorage = (value: any) => {
    setLocalProperty({ [source]: value });
  };

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

  return (
    <Layout className="app">
      <Header className="daily-header">
        <IconAvatar icon={<CalendarIcon />} />
        <Typography.Title level={1} className="daily-heading">
          TD <Translate pt="Diário" en="Daily" /> #{data.number}
        </Typography.Title>
      </Header>
      <Content>
        <Menu userDaily={currentUser.daily} hearts={hearts} openRules={!latestToday} />

        <DrawingCarousel drawings={data.drawings} />

        <Prompt text={data.text} correctLetters={correctLetters} />

        {(isComplete || hearts <= 0) && (
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary">
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
            <Button disabled>
              <Translate pt="Quer tentar desenhar?" en="Wanna Try Drawing?" />
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
          guessedLetters={guessedLetters}
          correctLetters={correctLetters}
          onLetterClick={guessLetter}
          disabled={hearts <= 0 || isComplete}
        />
      </Content>
    </Layout>
  );
}
