import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { BoxXIcon } from '@icons/BoxXIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { getSuspectImageId } from '@components/cards/SuspectCard';
import { ImageCard } from '@components/image-cards/ImageCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TextHighlight } from '@components/text/TextHighlight';
// Pages
import { NextGameSuggestion } from '@pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import type { DailyInvestigacaoEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { SuspectInfo } from './ReleaseModal';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  culpritId?: string;
  suspects: DailyInvestigacaoEntry['suspects'];
  reason: DailyInvestigacaoEntry['reason'];
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
        type: SETTINGS.ROUTE,
        language,
        challengeNumber: challengeNumber,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        released,
        totalSuspects: suspects.length,
      }),
    [language, challengeNumber, hearts, released, suspects.length],
  );

  return (
    <SpaceContainer vertical>
      <Typography.Title
        level={2}
        className="center"
      >
        {win ? (
          <>
            <IconAvatar icon={<TrophyIcon />} />{' '}
            <Translate
              pt="Parabéns!"
              en="Congratulations!"
            />
          </>
        ) : (
          <>
            <IconAvatar icon={<BoxXIcon />} />{' '}
            <Translate
              pt="Que pena!"
              en="Too bad!"
            />
          </>
        )}
      </Typography.Title>

      <Flex align="center">
        {culprit && (
          <ImageCard
            cardId={getSuspectImageId(culprit.id, 'gb')}
            cardWidth={96}
          />
        )}
        <Flex vertical>
          <Typography.Paragraph className="center">
            {win ? (
              <Translate
                pt="Você capturou o culpado pelo crime:"
                en="You caught the culprit for the crime:"
              />
            ) : (
              <Translate
                pt="Você deixou o culpado escapar! Crime:"
                en="You let the culprit escape! Crime:"
              />
            )}
          </Typography.Paragraph>
          <TextHighlight className="investigacao-crime-title">
            <Typography.Paragraph className="text-center">
              <DualTranslate>{reason}</DualTranslate>
            </Typography.Paragraph>
          </TextHighlight>
        </Flex>
      </Flex>

      {culprit && (
        <SuspectInfo
          name={culprit.name}
          features={culprit.features}
          gender={culprit.gender}
          variant="result"
        />
      )}

      <CopyToClipboardResult
        result={result}
        rows={3}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
