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
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  totalTime: number;
  score: number;
  title: string;
};

export function ResultsModalContent({
  challengeNumber,
  win,
  hearts,
  totalTime,
  score,
  title,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'vitrais',
        language,
        challengeNumber,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        timeElapsed: totalTime,
        score,
      }),
    [language, challengeNumber, hearts, totalTime, score],
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

      <Typography.Paragraph strong className="center">
        "{title}"
        <br />
        {score} <Translate pt="pontos" en="points" /> em {Math.floor(totalTime / 60)}:
        {(totalTime % 60).toString().padStart(2, '0')} <Translate pt="segundos" en="seconds" />.
      </Typography.Paragraph>

      <CopyToClipboardResult result={result} rows={4} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
