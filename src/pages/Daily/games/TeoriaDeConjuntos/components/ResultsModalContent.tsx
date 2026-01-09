import { useMemo } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { CircleIcon } from 'icons/CircleIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Pages
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import type { useTeoriaDeConjuntosEngine } from '../utils/useTeoriaDeConjuntosEngine';
import type { DailyTeoriaDeConjuntosEntry } from '../utils/types';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  isWin: boolean;
  hearts: number;
  guesses: ReturnType<typeof useTeoriaDeConjuntosEngine>['guesses'];
  data: DailyTeoriaDeConjuntosEntry;
  isWeekend: boolean;
};

export function ResultsModalContent({
  challengeNumber,
  isWin,
  hearts,
  guesses,
  data,
  isWeekend,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'teoria-de-conjuntos',
        challengeNumber,
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        language,
        guesses,
        isWeekend,
      }),
    [challengeNumber, hearts, language, guesses, isWeekend],
  );

  return (
    <SpaceContainer vertical>
      <Typography.Title
        level={2}
        className="center"
      >
        {isWin ? (
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

      <Typography.Paragraph className="center">
        Regra do círculo{' '}
        <IconAvatar
          icon={<CircleIcon mainColor="gold" />}
          size="small"
        />
        <br />
        <Typography.Text code> {data.rule1.text}</Typography.Text>
      </Typography.Paragraph>

      <Typography.Paragraph className="center">
        Regra do círculo{' '}
        <IconAvatar
          icon={<CircleIcon mainColor="red" />}
          size="small"
        />
        <br />
        <Typography.Text code> {data.rule2.text}</Typography.Text>
      </Typography.Paragraph>

      <CopyToClipboardResult
        result={result}
        rows={3}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
