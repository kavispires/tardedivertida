import { Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getDailyName, getSourceName } from 'pages/Daily/utils';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { getArteRuimName } from '../utils/helpers';
import { Letter } from 'pages/Daily/utils/types';

type ResultsModalContentProps = {
  challenge: number;
  text: string;
  win: boolean;
  hearts: number;
  attempts: Letter[][];
};

export function ResultsModalContent({ text, challenge, win, hearts, attempts }: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = writeResult({ challenge, remainingHearts: hearts, attempts, language });

  return (
    <Space direction="vertical" className="space-container">
      <Typography.Title level={2} className="center">
        {win ? (
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
        {win ? (
          <Translate pt="Você acertou a palavra!" en="You guessed the word!" />
        ) : (
          <Translate pt="Você errou a palavra!" en="You missed the word!" />
        )}
      </Typography.Paragraph>

      <TextHighlight className="result-answer">
        {<Typography.Paragraph>{text}</Typography.Paragraph>}
      </TextHighlight>

      <CopyToClipboardResult result={result} rows={6} />
    </Space>
  );
}

function writeResult({
  challenge,
  remainingHearts,
  attempts,
  language,
}: {
  challenge: number;
  remainingHearts: number;
  attempts: Letter[][];
  language: Language;
}) {
  const cleanUpAttempts = attempts.map((row) =>
    row.map((letter) => {
      if (letter.state === 'correct') {
        return '🟩';
      }
      if (letter.state === 'incorrect') {
        return '🟥';
      }
      if (letter.state === 'intermediate') {
        return '🟨';
      }

      if (letter.state === 'used') {
        return '⬛️';
      }

      return '';
    })
  );

  return [
    `💻 ${getDailyName(language)} ${getArteRuimName(language)} #${challenge}`,

    cleanUpAttempts
      .map((row) => row.join(' ').trim())
      .filter(Boolean)
      .join('\n'),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}/palavreado`,
  ].join('\n');
}
