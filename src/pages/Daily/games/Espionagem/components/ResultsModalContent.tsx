import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SuspectCard } from 'components/cards/SuspectCard';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TextHighlight } from 'components/text';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyEspionagemEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  win: boolean;
  hearts: number;
  culpritId?: string;
  suspects: DailyEspionagemEntry['suspects'];
  reason: DailyEspionagemEntry['reason'];
  released: string[];
};

export function ResultsModalContent({
  challenge,
  win,
  hearts,
  suspects,
  reason,
  released,
  culpritId,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();
  const culprit = suspects.find((s) => s.id === culpritId);

  const result = writeResult({
    language,
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    win,
    released,
  });

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
      <Typography.Paragraph className="center">
        {win ? (
          <Translate pt="Você capturou o culpado!" en="You caught the culprit!" />
        ) : (
          <Translate pt="Você deixou o culpado escapar!" en="You let the culprit escape!" />
        )}
      </Typography.Paragraph>

      <Flex align="center">
        {culprit && <SuspectCard suspect={culprit} width={96} />}
        <TextHighlight className="espionagem-crime-title">
          <Typography.Paragraph className="text-center">
            <DualTranslate>{reason}</DualTranslate>
          </Typography.Paragraph>
        </TextHighlight>
      </Flex>

      <CopyToClipboardResult result={result} rows={3} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  language,
  win,
  released,
}: {
  language: Language;
  game: string;
  challenge: number;
  remainingHearts: number;
  win: boolean;
  released: string[];
}) {
  const winIcon = win ? '🏆' : '☠️';

  // Calculate percentage based on how many suspects were released (0-8)
  const progress = released ? Math.round((released.length / 8) * 100) : 0;

  // Write the result string
  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${!challenge ? 'demo' : challenge}`,
    `${winIcon} ${writeHeartResultString(remainingHearts, SETTINGS.HEARTS)} (${progress}%)`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
