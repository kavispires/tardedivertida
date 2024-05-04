import { Divider, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getDailyName, getSourceName } from 'pages/Daily/utils';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { getPalavreadoName } from '../utils/helpers';
import { PalavreadoLetter } from '../utils/type';

type ResultsModalContentProps = {
  challenge: number;
  words: string[];
  isWin: boolean;
  isLose: boolean;
  hearts: number;
  guesses: PalavreadoLetter[][];
};

export function ResultsModalContent({
  challenge,
  words,
  isWin,
  isLose,
  hearts,
  guesses,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = writeResult({ challenge, remainingHearts: hearts, guesses, language });

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

      <CopyToClipboardResult result={result} rows={guesses.length + 1} />
    </Space>
  );
}

function writeResult({
  challenge,
  remainingHearts,
  guesses,
  language,
}: {
  challenge: number;
  remainingHearts: number;
  guesses: PalavreadoLetter[][];
  language: Language;
}) {
  const cleanUpAttempts = guesses.map((row) =>
    row.map((letter) => {
      switch (letter.state) {
        case '0':
          return '🟩';
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
    `📒 ${getDailyName(language)} ${getPalavreadoName(language)} #${challenge}`,
    cleanUpAttempts
      .map((row) => row.join(' ').trim())
      .filter(Boolean)
      .join('\n'),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
