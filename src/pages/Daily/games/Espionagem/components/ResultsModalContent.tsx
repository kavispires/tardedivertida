import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
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
import { getSuspectImageId } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TextHighlight } from 'components/text';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import type { DailyEspionagemEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  culpritId?: string;
  suspects: DailyEspionagemEntry['suspects'];
  reason: DailyEspionagemEntry['reason'];
  released: string[];
};

export function ResultsModalContent({
  challengeNumber,
  win,
  hearts,
  suspects,
  reason,
  released,
  culpritId,
}: ResultsModalContentProps) {
  const { language } = useLanguage();
  const culprit = suspects.find((s) => s.id === culpritId);

  const result = useMemo(
    () =>
      writeResult({
        type: 'espionagem',
        language,
        challengeNumber: challengeNumber,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        released,
      }),
    [language, challengeNumber, hearts, released],
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

      <Flex align="center">
        {culprit && <ImageCard id={getSuspectImageId(culprit.id, 'gb')} cardWidth={96} />}
        <Flex vertical>
          <Typography.Paragraph className="center">
            {win ? (
              <Translate
                pt="Você capturou o culpado pelo crime:"
                en="You caught the culprit for the crime:"
              />
            ) : (
              <Translate pt="Você deixou o culpado escapar! Crime:" en="You let the culprit escape! Crime:" />
            )}
          </Typography.Paragraph>
          <TextHighlight className="espionagem-crime-title">
            <Typography.Paragraph className="text-center">
              <DualTranslate>{reason}</DualTranslate>
            </Typography.Paragraph>
          </TextHighlight>
        </Flex>
      </Flex>

      <CopyToClipboardResult result={result} rows={3} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
