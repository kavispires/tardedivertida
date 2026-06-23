import { useMemo } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { BoxXIcon } from '@icons/BoxXIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
// Pages
import { NextGameSuggestion } from '@pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  totalButtons: number;
  farthestButtonIndex: number;
};

export function ResultsModalContent({
  challengeNumber,
  win,
  hearts,
  totalButtons,
  farthestButtonIndex,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const completionPercentage = useMemo(() => {
    return Math.round((farthestButtonIndex / totalButtons) * 100);
  }, [farthestButtonIndex, totalButtons]);

  const result = useMemo(
    () =>
      writeResult({
        type: SETTINGS.ROUTE,
        language,
        challengeNumber,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        percentage: completionPercentage,
      }),
    [language, challengeNumber, hearts, completionPercentage],
  );

  return (
    <SpaceContainer vertical>
      <Typography.Title
        level={2}
        className="center"
      >
        {win ? (
          <>
            <Icon icon={<TrophyIcon />} />{' '}
            <Translate
              pt="Parabéns!"
              en="Congratulations!"
            />
          </>
        ) : (
          <>
            <Icon icon={<BoxXIcon />} />{' '}
            <Translate
              pt="Cabum!!!"
              en="Kaboom!"
            />
          </>
        )}
      </Typography.Title>

      <Typography.Text
        strong
        className="center"
      >
        {completionPercentage}%
      </Typography.Text>

      <CopyToClipboardResult
        result={result}
        rows={4}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
