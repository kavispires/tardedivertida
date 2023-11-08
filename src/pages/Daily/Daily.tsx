import './daily.scss';

import { Button, Layout, Modal, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { PageError } from 'components/errors';
import { Translate } from 'components/language';
import { Loading } from 'components/loaders';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { CalendarIcon } from 'icons/CalendarIcon';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { useEffect, useState } from 'react';
import { useEffectOnce, useTitle } from 'react-use';
import { isDevEnv, removeDuplicates } from 'utils/helpers';

import { DailyChrome } from './components/DailyChrome';
import { DrawingCarousel } from './components/DrawingCarousel';
import { Keyboard } from './components/Keyboard';
import { Menu } from './components/Menu';
import { Prompt } from './components/Prompt';
import { ResultsModalContent } from './components/ResultsModalContent';
import { DailyEntry } from './types';
import { useDailyChallenge, useDailyChallengeMutation } from './useDaily';
import { getLettersInWord, getToday } from './utils';

const { Header, Content } = Layout;

function DailyPage() {
  useTitle('TD Diário - Tarde Divertida');
  const { isAuthenticated } = useCurrentUserContext();

  if (!isAuthenticated) {
    return (
      <DailyChrome>
        <LoginModal isAuthenticated={false} />
      </DailyChrome>
    );
  }

  return <DailyContent />;
}

function DailyContent() {
  const { currentUser } = useCurrentUserContext();
  const today = isDevEnv ? '2023-10-31' : getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(today);

  if (challengeQuery.isLoading) {
    return (
      <DailyChrome>
        <Space className="space-container">
          <Loading message="Carregando desafio" margin />
        </Space>
      </DailyChrome>
    );
  }

  if (challengeQuery.isError) {
    return (
      <DailyChrome>
        <PageError />
      </DailyChrome>
    );
  }

  const daily = challengeQuery.data.data;

  return <DailyGame daily={daily} currentUser={currentUser} />;
}

type DailyGameProps = {
  daily: DailyEntry;
  currentUser: Me;
};

function DailyGame({ daily, currentUser }: DailyGameProps) {
  const { setLanguage } = useLanguage();
  const [getLocalProperty, setLocalProperty] = useLocalStorage();
  useEffectOnce(() => {
    setLanguage('pt');
  });

  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(3);
  const [guessedLetters, setGuessedLetters] = useState<BooleanDictionary>({});
  const [correctLetters, setCorrectLetters] = useState<BooleanDictionary>(getLettersInWord(daily.text));
  const [showResultModal, setShowResultModal] = useState(false);

  const isComplete = Object.values(correctLetters).every(Boolean);

  const localToday = getLocalProperty(daily.id);
  const today = currentUser?.daily?.todaysChallenge ?? localToday;

  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (guessedLetters[letter]) {
      return;
    }
    // Add to the guessed letters
    setGuessedLetters((prev) => ({ ...prev, [letter]: true }));
    // SAve to local storage
    const localTodayTemp = getLocalProperty(daily.id);
    if (localTodayTemp) {
      setLocalProperty({
        [daily.id]: {
          ...localTodayTemp,
          letters: removeDuplicates([...(localTodayTemp.letters ?? {}), letter]),
        },
      });
    }

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
    if (today) {
      today!.letters.forEach((letter: string) => {
        guessLetter(letter);
      });
      if (currentUser?.daily?.todaysChallenge) {
        setLocalProperty({ [daily.id]: null });
      }
    } else {
      // Save to local storage
      setLocalProperty({
        [daily.id]: {
          id: daily.id,
          number: daily.number,
          victory: false,
          hearts,
          letters: Object.keys(guessedLetters),
        },
      });
    }
  }, [today]); // eslint-disable-line react-hooks/exhaustive-deps

  const dailyMutation = useDailyChallengeMutation();

  // Controls auto result modal
  useEffect(() => {
    if (isComplete || hearts <= 0) {
      setShowResultModal(true);
      setLocalProperty({ [daily.id]: null });

      if (!today && !dailyMutation.isLoading) {
        dailyMutation.mutate({
          id: daily.id,
          number: daily.number,
          victory: isComplete,
          hearts,
          letters: Object.keys(guessedLetters),
        });
        setLocalProperty({ [daily.id]: null });
      }
    }
  }, [isComplete, hearts, today, dailyMutation.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout className="app">
      <Header className="daily-header">
        <IconAvatar icon={<CalendarIcon />} />
        <Typography.Title level={1} className="daily-heading">
          TD Diário #{daily.number}
        </Typography.Title>
      </Header>
      <Content>
        <Menu userDaily={currentUser.daily} hearts={hearts} openRules={!today} />

        <DrawingCarousel drawings={daily.drawings} />

        <Prompt text={daily.text} correctLetters={correctLetters} />
        <Keyboard
          guessedLetters={guessedLetters}
          correctLetters={correctLetters}
          onLetterClick={guessLetter}
          disabled={hearts <= 0 || isComplete}
        />

        {(isComplete || hearts <= 0) && (
          <Space className="space-container">
            <Button onClick={() => setShowResultModal(true)} size="small" type="primary">
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}
        <Modal
          title={<Translate pt="Resultado" en="Resultado" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          <ResultsModalContent challenge={daily.number} win={isComplete} hearts={hearts} text={daily.text} />
        </Modal>
      </Content>
    </Layout>
  );
}

export default DailyPage;
