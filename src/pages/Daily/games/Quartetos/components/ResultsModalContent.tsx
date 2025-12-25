import clsx from 'clsx';
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
// Pages
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyQuartetosEntry } from '../utils/types';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  sets: DailyQuartetosEntry['sets'];
  guesses: string[];
  hearts: number;
};

export function ResultsModalContent({
  challengeNumber,
  win,
  sets,
  guesses,
  hearts,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'quartetos',
        challengeNumber,
        sets,
        guesses,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        language,
      }),
    [challengeNumber, guesses, language, sets, hearts],
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
