import clsx from 'clsx';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
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
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyOrganikuEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  win: boolean;
  hearts: number;
  culpritId?: string;
  itemsIds: DailyOrganikuEntry['itemsIds'];
  title: DailyOrganikuEntry['title'];
  foundCount: Record<string, number>;
  gridSize: number;
  flips: number;
};

export function ResultsModalContent({
  challenge,
  win,
  hearts,
  itemsIds,
  title,
  foundCount,
  gridSize,
  flips,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const correctItems = useMemo(() => {
    return itemsIds.map((itemId) => (foundCount[itemId] === gridSize ? itemId : null));
  }, [itemsIds, foundCount, gridSize]);

  const result = useMemo(
    () =>
      writeResult({
        language,
        game: dualTranslate(SETTINGS.NAME),
        challenge,
        remainingHearts: hearts,
        correctItems,
        flips,
      }),
    [language, dualTranslate, challenge, hearts, correctItems, flips],
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
            <ItemCard
              key={itemId}
              id={itemId}
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
            <ItemCard key={`empty-${index}`} id="0" width={45} className="organiku-incomplete-item" />
          ),
        )}
      </Flex>

      <CopyToClipboardResult result={result} rows={4} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  language,
  correctItems,
  flips,
}: {
  language: Language;
  game: string;
  challenge: number;
  remainingHearts: number;
  correctItems: (string | null)[];
  flips: number;
}) {
  // Write the result string
  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${!challenge ? 'demo' : challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS)} (${flips} viradas)`,
    `${correctItems.map((item) => (item ? '🟢' : '◼️')).join('')}`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
