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
// Pages
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyPortaisMagicosEntry } from '../utils/types';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  corridors: DailyPortaisMagicosEntry['corridors'];
  guesses: string[][];
  currentCorridorIndex: number;
  moves: number[];
  hearts: number;
  goal: number;
};

export function ResultsModalContent({
  challengeNumber,
  win,
  corridors,
  guesses,
  currentCorridorIndex,
  moves,
  hearts,
  goal,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'portais-magicos',
        challengeNumber,
        guesses,
        win,
        language,
        moves,
        totalHearts: SETTINGS.HEARTS,
        remainingHearts: hearts,
        goal,
      }),
    [challengeNumber, guesses, language, win, moves, hearts, goal],
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
