import { Flex, Input, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { ApplauseIcon } from 'icons/ApplauseIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getSourceName, getTitleName, writeHeartResultString } from 'pages/Daily/utils';
import { CopyToClipboardButton } from '../Common/CopyToClipboardButton';
import { SETTINGS } from './settings';

const titles = [
  <>
    <IconAvatar icon={<SkullIcon />} /> <Translate pt="Você é muito ruim!" en="You are really bad!" />
  </>,
  <>
    <IconAvatar icon={<SealOfApprovalIcon />} /> <Translate pt="Foi bem!" en="Pretty Good!" />
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
};

export function ResultsModalContent({
  challengeTitle,
  hearts,
  progress,
  itemsIds,
  win,
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

  const title = hearts === 0 ? titles[0] : titles?.[Math.ceil(progress / 3)];

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
        {itemsIds.slice(0, 5).map((id) => (
          <ItemCard key={id} id={id} width={45} />
        ))}
      </Flex>

      <CopyToClipboardButton content={result}>
        <Input.TextArea value={result} readOnly cols={30} rows={5} />
      </CopyToClipboardButton>

      <Typography.Paragraph className="center">
        <Translate
          pt="Clique no campo acima para copiar e compartilhe com os amigos"
          en="Click the field above to copy and share it with friends"
        />
      </Typography.Paragraph>
    </Space>
  );
}

const getAquiOName = (language: Language) => {
  return language === 'pt' ? 'Aqui Ó' : 'Find This';
};

function writeResult({
  // challengeNumber,
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
    `💻 ${getTitleName(language)} ${getAquiOName(language)}:`,
    `${title}`,
    writeHeartResultString(remainingHearts, totalHearts),
    `${progress}/${goal} 🔘`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}/aqui-o`,
  ].join('\n');
}
