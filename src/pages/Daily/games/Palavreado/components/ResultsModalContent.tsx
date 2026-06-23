import { useMemo } from 'react';
// Ant Design Resources
import { Divider, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { BoxXIcon } from '@icons/BoxXIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
import { VictoryCoinIcon } from '@icons/VictoryCoinIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
// Pages
import { NextGameSuggestion } from '@pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  words: string[];
  isWin: boolean;
  hearts: number;
  swaps: number;
  guesses: string[][];
  score: number;
  /**
   * Whether the smart shuffle hint was used
   */
  usedSmartShuffle: boolean;
};

export function ResultsModalContent({
  challengeNumber,
  words,
  isWin,
  hearts,
  swaps,
  guesses,
  usedSmartShuffle,
  score,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: SETTINGS.ROUTE,
        language,
        challengeNumber,
        remainingHearts: hearts,
        words,
        swaps,
        guesses,
        totalHearts: SETTINGS.HEARTS,
        score,
        usedSmartShuffle,
      }),
    [challengeNumber, hearts, words, language, swaps, guesses, usedSmartShuffle, score],
  );

  return (
    <SpaceContainer vertical>
      <Typography.Title
        level={2}
        className="center"
      >
        {isWin ? (
          <>
            <Icon icon={<TrophyIcon />} />{' '}
            <Translate
              pt="Parabéns!"
              en="Congratulations!"
            />
          </>
        ) : (
          <>
            <Icon icon={<BoxXIcon />} />{' '}
            <Translate
              pt="Que pena!"
              en="Too bad!"
            />
          </>
        )}
      </Typography.Title>
      <Typography.Paragraph className="center">
        {isWin ? (
          <Translate
            pt="Você acertou as palavras!"
            en="You guessed the words!"
          />
        ) : (
          <Translate
            pt="Você não acertou todas as palavras!"
            en="You missed the words!"
          />
        )}
        <br />
        <Translate
          pt={
            <>
              Sua pontuação:{' '}
              <Icon
                icon={<VictoryCoinIcon />}
                size="small"
              />{' '}
              {score} pontos
            </>
          }
          en={
            <>
              Your score:{' '}
              <Icon
                icon={<VictoryCoinIcon />}
                size="small"
              />{' '}
              {score} points
            </>
          }
        />
      </Typography.Paragraph>

      <Space
        className="result-answer"
        separator={<Divider orientation="vertical" />}
      >
        {words.map((word) => (
          <Typography.Text
            key={word}
            style={{ fontSize: words.length > 4 ? '0.95rem' : '1rem' }}
          >
            {word}
          </Typography.Text>
        ))}
      </Space>

      <CopyToClipboardResult
        result={result}
        rows={guesses[0].length + 2}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
