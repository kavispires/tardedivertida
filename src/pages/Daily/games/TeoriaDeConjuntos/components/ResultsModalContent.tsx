import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getSourceName, writeHeartResultString } from 'pages/Daily/utils';
// Ant Design Resources
import { Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { CircleIcon } from 'icons/CircleIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import type { useTeoriaDeConjuntosEngine } from '../utils/useTeoriaDeConjuntosEngine';
import type { DailyTeoriaDeConjuntosEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  isWin: boolean;
  hearts: number;
  guesses: ReturnType<typeof useTeoriaDeConjuntosEngine>['guesses'];
  data: DailyTeoriaDeConjuntosEntry;
};

export function ResultsModalContent({ challenge, isWin, hearts, guesses, data }: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    language,
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
    </SpaceContainer>
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
    }[String(guess.result)];
  });

  return [
    `${SETTINGS.ICON} TD ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS, ' ')}`,
    cleanUpAttempts.join(' '),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
