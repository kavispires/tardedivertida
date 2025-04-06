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
  corridors: DailyPortaisMagicosEntry['corridors'];
  guesses: string[][];
  currentCorridorIndex: number;
  moves: number;
  hearts: number;
};

export function ResultsModalContent({
  challenge,
  win,
  corridors,
  guesses,
  currentCorridorIndex,
  moves,
  hearts,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        game: dualTranslate(SETTINGS.NAME),
        challenge,
        guesses,
        win,
        language,
        moves,
        remainingHearts: hearts,
      }),
    [challenge, dualTranslate, guesses, language, win, moves, hearts],
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

      <CopyToClipboardResult result={result} rows={4} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  guesses,
  win,
  language,
  moves,
  remainingHearts,
}: {
  game: string;
  challenge: number;
  guesses: string[][];
  win: boolean;
  language: Language;
  moves: number;
  remainingHearts: number;
}) {
  const lastPlayedIndex = guesses.filter((guess) => guess.length > 0).length - 1;

  const result = guesses
    ?.map((guessBatch, index) => {
      const isLastGuessingRound = lastPlayedIndex === index;

      const quantity = Math.max(guessBatch?.length ?? 0, 0);

      const lostLives = Math.max(quantity - (isLastGuessingRound ? (win ? 1 : 0) : 1), 0);
      // Lost lives
      const lostHearts = Array(lostLives)
        .fill(0)
        .map(() => '💥')
        .join('');

      const correct = quantity - lostLives > 0 ? '🔶' : '';

      return [lostHearts, correct].join('');
    })
    .join('');

  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS)} (${moves} movimentos)`,
    result,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
