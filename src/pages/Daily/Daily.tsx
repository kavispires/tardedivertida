import './daily.scss';

import { App, Button, Layout, Modal, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { LoadingPage } from 'components/loaders';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { CalendarIcon } from 'icons/CalendarIcon';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useTitle } from 'react-use';
import { DAILY_API } from 'services/adapters';
import { print } from 'utils/helpers';

import { DrawingCarousel } from './components/DrawingCarousel';
import { Keyboard } from './components/Keyboard';
import { Menu } from './components/Menu';
import { Prompt } from './components/Prompt';
import { ResultsModalContent } from './components/ResultsModalContent';
import { DailyEntry } from './types';
import { getLettersInWord } from './utils';

const { Header, Content } = Layout;

type DailyChromeProps = {
  challenge?: ReactNode;
  children: ReactNode;
};

function DailyChrome({ challenge, children }: DailyChromeProps) {
  return (
    <Layout className="app">
      <Header className="daily-header">
        <IconAvatar icon={<CalendarIcon />} />
        <Typography.Title level={1} className="daily-heading">
          TD Desafio Diário {challenge}
        </Typography.Title>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
}

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
  const { notification } = App.useApp();
  const { currentUser } = useCurrentUserContext();
  // const today = getToday();
  const today = '2023-10-31';

  // Load challenge
  const challengeQuery = useQuery<any>({
    queryKey: ['daily'],
    queryFn: async () => {
      console.count('Fetching user...');
      return await DAILY_API.getDaily({ date: today });
    },
    retry: false,
    onSuccess: (response) => {
      const data = response.data;
      print({ daily: data }, 'table');
    },
    onError: (e: any) => {
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
    },
  });

  if (challengeQuery.isLoading) {
    return (
      <DailyChrome>
        <LoadingPage />
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
  // If already play, show winning screen

  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(3);
  const [guessedLetters, setGuessedLetters] = useState<BooleanDictionary>({});
  const [correctLetters, setCorrectLetters] = useState<BooleanDictionary>(getLettersInWord(daily.text));
  const isComplete = Object.values(correctLetters).every(Boolean);

  const [showResultModal, setShowResultModal] = useState(false);

  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (guessedLetters[letter]) {
      return;
    }
    // Add to the guessed letters
    setGuessedLetters((prev) => ({ ...prev, [letter]: true }));
    // If it is a correct letter, make it true
    if (correctLetters[letter] !== undefined) {
      setCorrectLetters((prev) => ({ ...prev, [letter]: true }));
    } else {
      // Otherwise, lose a heart
      setHearts((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isComplete || hearts <= 0) {
      setShowResultModal(true);
    }
  }, [isComplete, hearts]);

  return (
    <Layout className="app">
      <Header className="daily-header">
        <IconAvatar icon={<CalendarIcon />} />
        <Typography.Title level={1} className="daily-heading">
          TD Desafio Diário #{daily.number}!
        </Typography.Title>
      </Header>
      <Content>
        <Menu userDaily={currentUser.daily} hearts={hearts} />

        <DrawingCarousel drawings={daily.drawings} />

        <Prompt text={daily.text} correctLetters={correctLetters} />
        <Keyboard
          guessedLetters={guessedLetters}
          correctLetters={correctLetters}
          onLetterClick={guessLetter}
          disabled={hearts <= 0 || isComplete}
        />

        {isComplete && (
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
