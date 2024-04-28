import { Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { getArteRuimName } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';

type ResultsModalContentProps = {
  challenge: number;
  text: string;
  win: boolean;
  hearts: number;
  correctLetters: BooleanDictionary;
};

export function ResultsModalContent({
  text,
  challenge,
  win,
  hearts,
  correctLetters,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = writeResult({ challenge, remainingHearts: hearts, correctLetters, language });

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

      <CopyToClipboardResult result={result} rows={3} />
    </Space>
  );
}

function writeResult({
  challenge,
  remainingHearts,
  correctLetters,
  language,
}: {
  challenge: number;
  remainingHearts: number;
  correctLetters: BooleanDictionary;
  language: Language;
}) {
  const totalLetters = Object.keys(correctLetters).length;
  const guessedLetters = Object.values(correctLetters).filter(Boolean).length;

  return [
    `💻 ${getDailyName(language)} ${getArteRuimName(language)} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS)} (${Math.round((guessedLetters / totalLetters) * 100)}%)`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}/arte-ruim`,
  ].join('\n');
}
