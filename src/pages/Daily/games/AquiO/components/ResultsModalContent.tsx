import clsx from 'clsx';
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { ApplauseIcon } from 'icons/ApplauseIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

const titles = [
  <Fragment key="1">
    <IconAvatar icon={<SkullIcon />} /> <Translate pt="Você é muito ruim!" en="You are really bad!" />
  </Fragment>,
  <Fragment key="2">
    <IconAvatar icon={<SealOfApprovalIcon />} /> <Translate pt="Foi bem mais ou menos!" en="Pretty Weak!" />
  </Fragment>,
  <Fragment key="3">
    <IconAvatar icon={<ApplauseIcon />} /> <Translate pt="Muito bom!" en="Very good!" />
  </Fragment>,
  <Fragment key="4">
    <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Parabéns!" en="Congratulations!" />
  </Fragment>,
  <Fragment key="5">
    <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Incrível!" en="Incredible!" />
  </Fragment>,
];

const getTitle = (progress: number, remainingHearts: number) => {
  if (progress <= 3 || remainingHearts === 0) return titles[0];
  if (progress <= 8) return titles[1];
  if (progress <= 10) return titles[2];
  if (progress < 15) return titles[3];

  return titles[4];
};

type ResultsModalContentProps = {
  challengeTitle: DualLanguageValue;
  challengeNumber: number;
  hearts: number;
  progress: number;
  itemsIds: string[];
  hardMode: boolean;
  lastMatch: string;
  maxProgress: number;
  attempts: number;
  isWin: boolean;
  isLose: boolean;
};

export function ResultsModalContent({
  challengeTitle,
  challengeNumber,
  hearts,
  progress,
  itemsIds,
  hardMode,
  lastMatch,
  maxProgress,
  attempts,
  isWin,
  isLose,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'aqui-o',
        title: dualTranslate(challengeTitle),
        remainingHearts: hearts,
        totalHearts: SETTINGS.HEARTS,
        progress: Math.max(progress, maxProgress),
        goal: SETTINGS.GOAL,
        language,
        hardMode,
        challengeNumber,
        attempts,
      }),
    [
      challengeTitle,
      hearts,
      progress,
      maxProgress,
      hardMode,
      challengeNumber,
      attempts,
      dualTranslate,
      language,
    ],
  );

  const title = getTitle(progress, hearts);
  const worse = maxProgress > progress;
  const isComplete = isWin || isLose;

  return (
    <SpaceContainer vertical>
      <Typography.Title level={2} className="center">
        {title}
      </Typography.Title>
      {progress > 0 && (
        <Typography.Paragraph className="center">
          <Translate
            pt={`Você avançou ${progress} discos de ${SETTINGS.GOAL}.`}
            en={`You advanced ${progress} discs out of ${SETTINGS.GOAL}.`}
          />
        </Typography.Paragraph>
      )}

      <Typography.Paragraph className="center">
        {!isComplete && (
          <Translate
            pt="Você pode tentar novamente até conseguir 15 ou até não ter mais corações."
            en="You can try again until you reach 15 or until you run out of hearts."
          />
        )}
        {(worse || isComplete) && (
          <>
            <br />
            <Translate
              pt={`Seu melhor hoje foi de ${maxProgress} discos.`}
              en={`Your best today was ${maxProgress} discs.`}
            />
            {!isComplete && <Translate pt=" Tente novamente!" en=" Try again!" />}
          </>
        )}
      </Typography.Paragraph>

      <Flex gap={6}>
        {!!lastMatch && (
          <DailyItem
            id={lastMatch}
            width={45}
            className={clsx(getAnimationClass('pulse', { speed: 'fast' }), 'item-match-outline')}
          />
        )}
        {progress > 0 &&
          itemsIds
            .filter((id) => id !== lastMatch)
            .slice(0, Math.floor((progress - 1) / 3))
            .map((id, index) => (
              <DailyItem
                key={id}
                id={id}
                width={45}
                className={getAnimationClass('pulse', {
                  speed: 'fast',
                  delay: index * 0.5,
                })}
              />
            ))}
      </Flex>

      <CopyToClipboardResult result={result} rows={4} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
