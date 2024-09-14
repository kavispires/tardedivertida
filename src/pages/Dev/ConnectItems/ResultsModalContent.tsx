import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';
// Ant Design Resources
import { App, Input, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
// Internal
import { ConnectionGame, GroupSummary } from './types';

type ResultsModalContentProps = {
  game: ConnectionGame;
  win: boolean;
  hearts: number;
  resultPrint: string;
  correctGroups: GroupSummary[];
};

export function ResultsModalContent({
  game,
  win,
  hearts,
  resultPrint,
  correctGroups,
}: ResultsModalContentProps) {
  const { message } = App.useApp();
  const { translate, language } = useLanguage();
  const [state, copyToClipboard] = useCopyToClipboard();
  const result = writeResult(game, hearts, resultPrint, language, correctGroups);

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

  return (
    <Space direction="vertical" className="space-container">
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
      <Typography.Paragraph className="center">
        {win ? (
          <Translate pt="Você acertou os trios!" en="You guessed the trios!" />
        ) : (
          <Translate pt="Você não fez todos os trios!" en="You did not create all trios!" />
        )}
      </Typography.Paragraph>

      {/* <TextHighlight className="result-answer">
      <Input.TextArea value={resultPrint} rows={3} cols={9} />
      </TextHighlight> */}

      <TransparentButton onClick={() => copyToClipboard(result)}>
        <Input.TextArea value={result} readOnly cols={30} rows={9} />
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

function writeResult(
  game: ConnectionGame,
  hearts: number = 0,
  resultPrint: string,
  language: Language,
  correctGroups: GroupSummary[]
) {
  let result = '';
  const gameId = game.id;

  const heartsValue = Math.max(0, hearts);
  const gameName = language === 'pt' ? 'Conexões Triplas' : 'Connect Trio';

  result += '🔗 ' + gameName + ' #' + gameId + '\n';
  result +=
    Array(heartsValue).fill('❤️').join('') +
    Array(3 - heartsValue)
      .fill('🩶')
      .join('');
  result += ` (${Math.round(((correctGroups.length + heartsValue) / 6) * 100)}%)`;
  result += '\n';
  result += resultPrint;
  result += '\nhttps://www.kavispires.com/tardedivertida/#/trio';

  return result;
}
