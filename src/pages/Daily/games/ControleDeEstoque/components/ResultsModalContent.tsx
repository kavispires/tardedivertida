import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getSourceName, writeHeartResultString } from 'pages/Daily/utils';
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
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  title: string;
  isWin: boolean;
  hearts: number;
  evaluations: boolean[][];
};

export function ResultsModalContent({
  challenge,
  title,
  isWin,
  hearts,
  evaluations,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    language,
    evaluations,
  });

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

function writeResult({
  game,
  challenge,
  remainingHearts,
  language,
  evaluations,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  language: Language;
  evaluations: boolean[][];
}) {
  const cleanUpAttempts = evaluations.map((row) =>
    row.map((value) => {
      return value ? '📫' : '🤬';
    }),
  );

  return [
    `${SETTINGS.ICON} TD ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS, ' ')}`,
    cleanUpAttempts
      .map((row) => row.join(' ').trim())
      .filter(Boolean)
      .join('\n'),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
