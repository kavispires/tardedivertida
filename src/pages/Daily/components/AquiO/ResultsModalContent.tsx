import { App, Flex, Input, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { ApplauseIcon } from 'icons/ApplauseIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { getTitleName } from 'pages/Daily/utils';
import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

type ResultsModalContentProps = {
  challengeTitle: string;
  finished: boolean;
  hearts: number;
  progress: number;
  itemsIds: string[];
};

const titles: any = {
  5: (
    <>
      <IconAvatar icon={<SkullIcon />} /> <Translate pt="Você é muito ruim!" en="You are really bad!" />
    </>
  ),
  10: (
    <>
      <IconAvatar icon={<SealOfApprovalIcon />} /> <Translate pt="Foi bem!" en="Pretty Good!" />
    </>
  ),
  15: (
    <>
      <IconAvatar icon={<ApplauseIcon />} /> <Translate pt="Muito bom!" en="Very good!" />
    </>
  ),
  20: (
    <>
      <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Parabéns!" en="Congratulations!" />
    </>
  ),
  25: (
    <>
      <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Incrível!" en="Incredible!" />
    </>
  ),
};

export function ResultsModalContent({
  challengeTitle,
  finished,
  hearts,
  progress,
  itemsIds,
}: ResultsModalContentProps) {
  const { message } = App.useApp();
  const { translate, language } = useLanguage();
  const [state, copyToClipboard] = useCopyToClipboard();
  const result = writeResult(challengeTitle, hearts, progress, language);

  useEffect(() => {
    if (state.value) {
      message.info(
        translate(
          `Copiado para a área de transferência: ${state.value}`,
          `Copied to clipboard: ${state.value}`
        )
      );
    }
  }, [state, message, translate]);

  const title = titles?.[Math.ceil(progress / 5)];

  return (
    <Space direction="vertical" className="space-container">
      <Typography.Title level={2} className="center">
        {title}
      </Typography.Title>
      <Typography.Paragraph className="center">
        <Translate pt={`Você avançou ${progress} discos`} en={`You advanced ${progress} discs`} />
      </Typography.Paragraph>

      <Flex gap={6}>
        {itemsIds.slice(0, 5).map((id) => (
          <ItemCard key={id} id={id} width={45} />
        ))}
      </Flex>

      <TransparentButton onClick={() => copyToClipboard(result)}>
        <Input.TextArea value={result} readOnly cols={30} rows={4} />
      </TransparentButton>

      <Typography.Paragraph className="center">
        <Translate
          pt="Clique no campo acima para copiar e compartilhe com os amigos"
          en="Click the field above to copy and share it with friends"
        />
      </Typography.Paragraph>
    </Space>
  );
}

function writeResult(challengeTitle: string, hearts: number = 0, progress: number, language: Language) {
  let result = '';

  const heartsValue = Math.max(0, hearts);

  if (language === 'pt') {
    result += '💻 ' + getTitleName(language) + ' Aqui Ó:\n' + challengeTitle + '\n';
    result +=
      Array(heartsValue).fill('❤️').join('') +
      Array(3 - heartsValue)
        .fill('🩶')
        .join('');
    result += `\n1 🔘 cada ~${Math.round(60 / progress)} segundos`;
    result += '\nhttps://www.kavispires.com/tardedivertida/#/diario/aqui-o';
  } else {
    result += '💻 ' + getTitleName(language) + ' Find this:\n' + challengeTitle + '\n';
    result +=
      Array(heartsValue).fill('❤️').join('') +
      Array(3 - heartsValue)
        .fill('🩶')
        .join('');
    result += `\n1 🔘 every ~${Math.round(60 / progress)} seconds)`;
    result += '\nhttps://www.kavispires.com/tardedivertida/#/daily/aqui-o';
  }

  return result;
}
