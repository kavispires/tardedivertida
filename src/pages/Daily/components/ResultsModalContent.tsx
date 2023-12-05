import { App, Input, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

type ResultsModalContentProps = {
  challenge: number;
  text: string;
  win: boolean;
  hearts: number;
  correctLetters: BooleanDictionary;
};

export function ResultsModalContent({
  text,
  challenge,
  win,
  hearts,
  correctLetters,
}: ResultsModalContentProps) {
  const { message } = App.useApp();
  const [state, copyToClipboard] = useCopyToClipboard();
  const result = writeResult(challenge, hearts, correctLetters);

  useEffect(() => {
    if (state.value) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, message]);

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
          <Translate pt="Você acertou a palavra!" en="You guessed the word!" />
        ) : (
          <Translate pt="Você errou a palavra!" en="You missed the word!" />
        )}
      </Typography.Paragraph>

      <TextHighlight className="result-answer">
        {<Typography.Paragraph>{text}</Typography.Paragraph>}
      </TextHighlight>

      <TransparentButton onClick={() => copyToClipboard(result)}>
        <Input.TextArea value={result} readOnly cols={30} rows={3} />
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

function writeResult(challenge: number, hearts: number = 0, correctLetters: BooleanDictionary = {}) {
  let result = '';
  const totalLetters = Object.keys(correctLetters).length;
  const guessedLetters = Object.values(correctLetters).filter(Boolean).length;

  result += '💻 TD Diário #' + challenge + '\n';
  result +=
    Array(hearts).fill('❤️').join('') +
    Array(3 - hearts)
      .fill('🩶')
      .join('');
  result += ` (${Math.round((guessedLetters / totalLetters) * 100)}%)`;
  result += '\nhttps://www.kavispires.com/tardedivertida/#/daily';

  return result;
}
