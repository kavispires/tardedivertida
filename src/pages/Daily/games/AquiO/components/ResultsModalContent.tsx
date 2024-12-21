import clsx from 'clsx';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
import { Fragment } from 'react/jsx-runtime';
// Ant Design Resources
import { Flex, Space, Typography } from 'antd';
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
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
// Internal
import { SETTINGS } from '../utils/settings';
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
  challengeTitle: string;
  challengeNumber: number;
  hearts: number;
  progress: number;
  itemsIds: string[];
  isRandomGame: boolean;
  hardMode: boolean;
  lastMatch: string;
  maxProgress: number;
  attempts: number;
};

export function ResultsModalContent({
  challengeTitle,
  challengeNumber,
  hearts,
  progress,
  itemsIds,
  isRandomGame,
  hardMode,
  lastMatch,
  maxProgress,
  attempts,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();
  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    title: challengeTitle,
    remainingHearts: hearts,
    totalHearts: SETTINGS.HEARTS,
    progress: Math.max(progress, maxProgress),
    goal: SETTINGS.GOAL,
    language,
    hardMode,
    challengeNumber,
    attempts,
  });

  const title = getTitle(progress, hearts);
  const worse = maxProgress > progress;

  return (
    <Space direction="vertical" className="space-container">
      <Typography.Title level={2} className="center">
        {title}
      </Typography.Title>
      <Typography.Paragraph className="center">
        <Translate
          pt={`Você avançou ${progress} discos de ${SETTINGS.GOAL}.`}
          en={`You advanced ${progress} discs out of ${SETTINGS.GOAL}.`}
        />
        <br />
      </Typography.Paragraph>
      {!isRandomGame && (
        <Typography.Paragraph className="center">
          <Translate
            pt="Você pode tentar novamente até conseguir 15 ou até não ter mais corações."
            en="You can try again until you reach 15 or until you run out of hearts."
          />
          {worse && (
            <>
              <br />
              <Translate
                pt={`Seu melhor hoje foi de ${maxProgress} discos. Tente novamente!`}
                en={`Your best today was ${maxProgress} discs. Try again!`}
              />
            </>
          )}
        </Typography.Paragraph>
      )}

      <Flex gap={6}>
        {!!lastMatch && (
          <ItemCard
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
              <ItemCard
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

      {!isRandomGame ? (
        <CopyToClipboardResult result={result} rows={3} />
      ) : (
        <Typography.Paragraph className="center">
          <Translate
            pt="Baralhos aleatórios não são compartilháveis, mas você pode jogar mais."
            en="Random decks are not shareable, but you can play more."
          />
        </Typography.Paragraph>
      )}

      <NextGameSuggestion />
    </Space>
  );
}

function writeResult({
  game,
  title,
  challengeNumber,
  remainingHearts,
  totalHearts,
  progress,
  goal,
  language,
  hardMode,
  attempts,
}: {
  game: string;
  title: string;
  challengeNumber: number;
  remainingHearts: number;
  totalHearts: number;
  progress: number;
  goal: number;
  language: Language;
  hardMode: boolean;
  attempts: number;
}): string {
  return [
    `${SETTINGS.ICON} ${getDailyName(language)} ${game} #${challengeNumber}`,
    `${title}${hardMode ? '*' : ''}: ${progress}/${goal}  ${writeHeartResultString(remainingHearts, totalHearts)}`,
    `Tentativas: ${attempts}`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
