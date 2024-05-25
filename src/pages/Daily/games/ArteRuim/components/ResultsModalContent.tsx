import { Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { BoxXIcon } from 'icons/BoxXIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
import { Link } from 'react-router-dom';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { SETTINGS } from '../utils/settings';

type ResultsModalContentProps = {
  challenge: number;
  text: string;
  win: boolean;
  hearts: number;
  solution: BooleanDictionary;
};

export function ResultsModalContent({ text, challenge, win, hearts, solution }: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    solution,
    language,
  });

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
        <Typography.Paragraph className="text-center">{text}</Typography.Paragraph>
      </TextHighlight>

      <CopyToClipboardResult result={result} rows={3} />

      <Typography.Paragraph className="center" strong>
        Já desenhou hoje? Novas frases todos os dias!
        <br />
        <IconAvatar icon={<DailyDrawingGameIcon />} />
        <Link to="/diario/artista">Picaço!</Link>
      </Typography.Paragraph>
    </Space>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  solution,
  language,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  solution: BooleanDictionary;
  language: Language;
}) {
  const totalLetters = Object.keys(solution).length;
  const guessedLetters = Object.values(solution).filter(Boolean).length;

  return [
    `💻 ${getDailyName(language)} ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS)} (${Math.round((guessedLetters / totalLetters) * 100)}%)`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
