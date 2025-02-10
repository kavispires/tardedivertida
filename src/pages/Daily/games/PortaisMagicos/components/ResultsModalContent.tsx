import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
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
import type { DailyPortaisMagicosEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  win: boolean;
  lose: boolean;
  hearts: number;
  corridors: DailyPortaisMagicosEntry['corridors'];
  guesses: string[][];
  currentCorridorIndex: number;
  width: number;
};

export function ResultsModalContent({
  challenge,
  win,
  lose,
  hearts,
  corridors,
  guesses,
  currentCorridorIndex,
  width,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        game: dualTranslate(SETTINGS.NAME),
        challenge,
        remainingHearts: hearts,
        guesses,
        win,
        language,
      }),
    [challenge, dualTranslate, guesses, hearts, language, win],
  );

  return (
    <SpaceContainer vertical>
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

      <SpaceContainer vertical>
        {corridors.map(({ passcode }, index, arr) => (
          <Flex key={passcode} justify="center" className="result-passcode">
            <Typography.Text keyboard>{passcode}</Typography.Text>{' '}
            {currentCorridorIndex > index && guesses?.[index]?.length
              ? '🔶'
              : arr.length - 1 === index && win
                ? '🔶'
                : '💥'}
          </Flex>
        ))}
      </SpaceContainer>

      <CopyToClipboardResult result={result} rows={3} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  guesses,
  win,
  language,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  guesses: string[][];
  win: boolean;
  language: Language;
}) {
  const indexEmojis = ['🔶', '💥'];

  const result = guesses
    ?.map((guessBatch) => {
      const quantity = Math.max(guessBatch?.length ?? 0, 0);
      return Array(quantity)
        .map((item, i) => {
          const guess = guessBatch[i];
          const emoji = indexEmojis[i];
          return '🔶';
        })
        .join('');
    })
    .join('');

  return [
    `${SETTINGS.ICON} ${getDailyName(language)} ${game} #${challenge}`,
    writeHeartResultString(remainingHearts, SETTINGS.HEARTS),
    result,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}/portais-magicos`,
  ].join('\n');
}
