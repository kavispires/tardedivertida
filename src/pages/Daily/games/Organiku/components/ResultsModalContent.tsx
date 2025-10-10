import clsx from 'clsx';
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyOrganikuEntry } from '../utils/types';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  culpritId?: string;
  itemsIds: DailyOrganikuEntry['itemsIds'];
  title: DailyOrganikuEntry['title'];
  foundCount: Record<string, number>;
  gridSize: number;
  flips: number;
  swapLimit: number;
};

export function ResultsModalContent({
  challengeNumber,
  win,
  hearts,
  itemsIds,
  title,
  foundCount,
  gridSize,
  flips,
  swapLimit,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const correctItems = useMemo(() => {
    return itemsIds.map((itemId) => (foundCount[itemId] === gridSize ? itemId : null));
  }, [itemsIds, foundCount, gridSize]);

  const result = useMemo(
    () =>
      writeResult({
        type: 'organiku',
        language,
        challengeNumber,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        itemsIds,
        foundCount,
        flips,
        swapLimit,
      }),
    [language, challengeNumber, hearts, foundCount, itemsIds, flips, swapLimit],
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

      <Typography.Text strong className="center">
        {title}
      </Typography.Text>

      <Flex align="center" gap={3}>
        {correctItems.map((itemId, index) =>
          itemId ? (
            <DailyItem
              key={itemId}
              itemId={itemId}
              width={45}
              className={clsx(
                getAnimationClass('pulse', {
                  speed: 'fast',
                  delay: index * 0.5,
                  infinite: true,
                }),
                'organiku-complete-item',
              )}
            />
          ) : (
            <DailyItem key={`empty-${index}`} itemId="0" width={45} className="organiku-incomplete-item" />
          ),
        )}
      </Flex>

      <CopyToClipboardResult result={result} rows={4} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
