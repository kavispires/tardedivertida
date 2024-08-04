import { Divider, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { SETTINGS } from '../utils/settings';
import { PalavreadoLetter } from '../utils/types';
import { chunk } from 'lodash';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';

type ResultsModalContentProps = {
  challenge: number;
  words: string[];
  isWin: boolean;
  isLose: boolean;
  hearts: number;
  letters: PalavreadoLetter[];
  swaps: number;
};

export function ResultsModalContent({
  challenge,
  words,
  isWin,
  isLose,
  hearts,
  letters,
  swaps,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    letters,
    language,
    swaps,
  });

  return (
    <Space direction="vertical" className="space-container">
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

      <CopyToClipboardResult result={result} rows={6} />

      <NextGameSuggestion />
    </Space>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  letters,
  language,
  swaps,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  letters: PalavreadoLetter[];
  language: Language;
  swaps: number;
}) {
  const cleanUpAttempts = chunk(letters, 4).map((row) =>
    row.map((letter) => {
      switch (letter.state) {
        case '0':
          return '🟥';
        case '1':
          return '🟦';
        case '2':
          return '🟪';
        case '3':
          return '🟫';
        default:
          return '⬜️';
      }
    })
  );

  return [
    `📒 ${getDailyName(language)} ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS, ' ')} (${swaps} trocas)`,
    cleanUpAttempts
      .map((row) => row.join(' ').trim())
      .filter(Boolean)
      .join('\n'),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
