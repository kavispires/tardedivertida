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
        type: SETTINGS.ROUTE,
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
      <Typography.Title
        level={2}
        className="center"
      >
        {isWin ? (
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
              pt="Que pena!"
              en="Too bad!"
            />
          </>
        )}
      </Typography.Title>

      <Typography.Text
        strong
        className="center"
      >
        {title}
      </Typography.Text>

      <Typography.Paragraph className="center">
        {isWin ? (
          <Translate
            pt="Você entregou todos os pedidos!"
            en="You delivered all orders!"
          />
        ) : (
          <Translate
            pt="Você não conseguiu entregar todos os pedidos."
            en="You couldn't deliver all orders."
          />
        )}
      </Typography.Paragraph>

      <CopyToClipboardResult
        result={result}
        rows={6}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
