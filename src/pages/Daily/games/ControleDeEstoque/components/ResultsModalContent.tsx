import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
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
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  title: string;
  isWin: boolean;
  hearts: number;
  evaluations: boolean[][];
};

export function ResultsModalContent({
  challengeNumber,
  title,
  isWin,
  hearts,
  evaluations,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'controle-de-estoque',
        language,
        title,
        challengeNumber,
        totalHearts: SETTINGS.HEARTS,
        remainingHearts: hearts,
        evaluations,
      }),
    [challengeNumber, evaluations, hearts, language, title],
  );

  return (
    <SpaceContainer vertical>
      <Typography.Title level={2} className="center">
        {isWin ? (
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

      <Typography.Paragraph className="center">
        {isWin ? (
          <Translate pt="Você entregou todos os pedidos!" en="You delivered all orders!" />
        ) : (
          <Translate
            pt="Você não conseguiu entregar todos os pedidos."
            en="You couldn't deliver all orders."
          />
        )}
      </Typography.Paragraph>

      <CopyToClipboardResult result={result} rows={6} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
