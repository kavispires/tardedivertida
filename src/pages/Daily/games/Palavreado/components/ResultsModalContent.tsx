import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { useMemo } from 'react';
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
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  words: string[];
  isWin: boolean;
  hearts: number;
  swaps: number;
  guesses: string[][];
};

export function ResultsModalContent({
  challengeNumber,
  words,
  isWin,
  hearts,
  swaps,
  guesses,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'palavreado',
        language,
        challengeNumber,
        remainingHearts: hearts,
        words,
        swaps,
        guesses,
        totalHearts: SETTINGS.HEARTS,
      }),
    [challengeNumber, hearts, words, language, swaps, guesses],
  );

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
