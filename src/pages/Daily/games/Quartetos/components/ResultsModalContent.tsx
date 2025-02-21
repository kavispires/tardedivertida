import clsx from 'clsx';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName } from 'pages/Daily/utils';
import { useMemo } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
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
import type { DailyQuartetosEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  win: boolean;
  sets: DailyQuartetosEntry['sets'];
  guesses: string[];
};

export function ResultsModalContent({ challenge, win, sets, guesses }: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        game: dualTranslate(SETTINGS.NAME),
        challenge,
        sets,
        guesses,
        win,
        language,
      }),
    [challenge, dualTranslate, guesses, language, win, sets],
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
        {sets.map((set) => (
          <div key={set.id} className={clsx('set-result-title', `set-match--set-${set.level}`)}>
            {set.title}
          </div>
        ))}
      </SpaceContainer>

      <CopyToClipboardResult result={result} rows={5} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  guesses,
  sets,
  language,
}: {
  game: string;
  challenge: number;
  guesses: string[];
  sets: DailyQuartetosEntry['sets'];
  win: boolean;
  language: Language;
}) {
  const EMOJIS = ['🟩', '🟨', '🟧', '🟪'];
  const EMOJIS_MAP = sets.reduce((acc: StringDictionary, set) => {
    set.itemsIds.forEach((itemId) => {
      acc[itemId] = EMOJIS[set.level];
    });
    return acc;
  }, {});

  const result = guesses.map((guess) => {
    const guessItems = guess.split('-');
    const guessResult = guessItems.map((itemId) => EMOJIS_MAP[itemId] || '❓').join(' ');
    return guessResult;
  });

  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${challenge}`,

    ...result,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
