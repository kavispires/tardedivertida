import { Flex, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { ApplauseIcon } from 'icons/ApplauseIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getSourceName, getDailyName, writeHeartResultString } from 'pages/Daily/utils';
import { getAnimationClass } from 'utils/helpers';

import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';
import { SETTINGS } from '../utils/settings';

const titles = [
  <>
    <IconAvatar icon={<SkullIcon />} /> <Translate pt="Você é muito ruim!" en="You are really bad!" />
  </>,
  <>
    <IconAvatar icon={<SealOfApprovalIcon />} /> <Translate pt="Foi bem mais ou menos!" en="Pretty Weak!" />
  </>,
  <>
    <IconAvatar icon={<ApplauseIcon />} /> <Translate pt="Muito bom!" en="Very good!" />
  </>,
  <>
    <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Parabéns!" en="Congratulations!" />
  </>,
  <>
    <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Incrível!" en="Incredible!" />
  </>,
];

type ResultsModalContentProps = {
  challengeTitle: string;
  hearts: number;
  progress: number;
  itemsIds: string[];
  win: boolean;
  isRandomGame: boolean;
};

export function ResultsModalContent({
  challengeTitle,
  hearts,
  progress,
  itemsIds,
  win,
  isRandomGame,
}: ResultsModalContentProps) {
  const { language } = useLanguage();
  const result = writeResult({
    title: challengeTitle,
    remainingHearts: hearts,
    totalHearts: SETTINGS.HEARTS,
    progress,
    goal: SETTINGS.GOAL,
    language,
  });

  const progressLevel = Math.floor(progress / 3);
  const title = win ? titles[4] : hearts === 0 ? titles[0] : titles?.[progressLevel];

  return (
    <Space direction="vertical" className="space-container">
      <Typography.Title level={2} className="center">
        {title}
      </Typography.Title>
      <Typography.Paragraph className="center">
        <Translate
          pt={`Você avançou ${progress} discos de ${SETTINGS.GOAL}`}
          en={`You advanced ${progress} discs out of ${SETTINGS.GOAL}`}
        />
      </Typography.Paragraph>

      <Flex gap={6}>
        {itemsIds.slice(0, Math.ceil(progress / 3)).map((id, index) => (
          <ItemCard
            key={id}
            id={id}
            width={45}
            className={getAnimationClass('pulse', { speed: 'fast', delay: index * 0.5 })}
          />
        ))}
      </Flex>

      {!isRandomGame && <CopyToClipboardResult result={result} rows={4} />}
    </Space>
  );
}

export const getAquiOName = (language: Language) => {
  return language === 'pt' ? 'Aqui Ó' : 'Find This';
};

function writeResult({
  title,
  remainingHearts,
  totalHearts,
  progress,
  goal,
  language,
}: {
  // challengeNumber,
  title: string;
  remainingHearts: number;
  totalHearts: number;
  progress: number;
  goal: number;
  language: Language;
}): string {
  return [
    `🔘 ${getDailyName(language)} ${getAquiOName(language)}:`,
    `${title}`,
    `${writeHeartResultString(remainingHearts, totalHearts)}     ${progress}/${goal} `,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}/aqui-o`,
  ].join('\n');
}
