import { Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getSourceName, writeHeartResultString } from 'pages/Daily/utils';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { SETTINGS } from '../utils/settings';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { useTeoriaDeConjuntosEngine } from '../utils/useTeoriaDeConjuntosEngine';
import { CircleIcon } from 'icons/CircleIcon';
import { DailyTeoriaDeConjuntosEntry } from '../utils/types';

type ResultsModalContentProps = {
  challenge: number;
  title: string;
  isWin: boolean;
  hearts: number;
  guesses: ReturnType<typeof useTeoriaDeConjuntosEngine>['guesses'];
  data: DailyTeoriaDeConjuntosEntry;
};

export function ResultsModalContent({
  challenge,
  title,
  isWin,
  hearts,
  guesses,
  data,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    language,
    guesses,
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
        Regra do círculo <IconAvatar icon={<CircleIcon mainColor="gold" />} size="small" />
        <br />
        <Typography.Text code> {data.rule1.text}</Typography.Text>
      </Typography.Paragraph>

      <Typography.Paragraph className="center">
        Regra do círculo <IconAvatar icon={<CircleIcon mainColor="red" />} size="small" />
        <br />
        <Typography.Text code> {data.rule2.text}</Typography.Text>
      </Typography.Paragraph>

      <CopyToClipboardResult result={result} rows={3} />

      <NextGameSuggestion />
    </Space>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  language,
  guesses,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  language: Language;
  guesses: ReturnType<typeof useTeoriaDeConjuntosEngine>['guesses'];
}) {
  const cleanUpAttempts = guesses.map((guess) => {
    return {
      1: '🟡',
      2: '🔴',
      0: '🟠',
      false: '✖️',
    }[String(guess)];
  });

  return [
    `${SETTINGS.ICON} TD ${game} #D${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS, ' ')}`,
    cleanUpAttempts.join(' '),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}/teoria-de-conjuntos/${challenge}`,
  ].join('\n');
}
