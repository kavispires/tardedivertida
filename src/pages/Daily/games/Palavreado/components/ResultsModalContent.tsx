import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
// Ant Design Resources
import { Divider, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  words: string[];
  isWin: boolean;
  hearts: number;
  swaps: number;
  guesses: string[][];
};

export function ResultsModalContent({
  challenge,
  words,
  isWin,
  hearts,
  swaps,
  guesses,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    words,
    language,
    swaps,
    guesses,
  });

  return (
    <SpaceContainer vertical>
      <Typography.Title level={2} className="center">
        {isWin ? (
          <>
            <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Parabéns!" en="Congratulations!" />
          </>
        ) : (
          <>
            <IconAvatar icon={<BoxXIcon />} /> <Translate pt="Que pena!" en="Too bad!" />
          </>
        )}
      </Typography.Title>
      <Typography.Paragraph className="center">
        {isWin ? (
          <Translate pt="Você acertou as palavras!" en="You guessed the words!" />
        ) : (
          <Translate pt="Você não acertou todas as palavras!" en="You missed the words!" />
        )}
      </Typography.Paragraph>

      <Space className="result-answer" split={<Divider type="vertical" />}>
        {words.map((word) => (
          <Typography.Text key={word}>{word}</Typography.Text>
        ))}
      </Space>

      <CopyToClipboardResult result={result} rows={guesses[0].length + 2} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  words,
  language,
  swaps,
  guesses,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  words: string[];
  language: Language;
  swaps: number;
  guesses: string[][];
}) {
  const size = guesses[0].length;
  const colors = ['🟥', '🟦', '🟪', '🟫', '🟧'];
  const cleanUpAttempts = guesses.map((attempt) => {
    return attempt.map((word, i) => {
      const wordState = words[i].toLowerCase() === word.toLowerCase() ? colors[i] : '⬜️';
      return wordState;
    });
  });
  if (cleanUpAttempts.length < size) {
    while (cleanUpAttempts.length < size) {
      cleanUpAttempts.push(cleanUpAttempts[cleanUpAttempts.length - 1]);
    }
  }

  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, Math.max(SETTINGS.HEARTS, size), ' ')} (${swaps} trocas)`,
    cleanUpAttempts
      .map((row) => row.join(' ').trim())
      .filter(Boolean)
      .join('\n'),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
