import { App, Input, Space, Typography } from 'antd';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';
import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

type ResultsModalContentProps = {
  challenge: number;
  text: string;
  win: boolean;
  hearts: number;
};

export function ResultsModalContent({ text, challenge, win, hearts }: ResultsModalContentProps) {
  const { message } = App.useApp();
  const [state, copyToClipboard] = useCopyToClipboard();
  const result = writeResult(challenge, hearts);

  useEffect(() => {
    if (state.value) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, message]);

  return (
    <Space direction="vertical">
      <Typography.Title level={2}>
        {win ? (
          <Translate pt="Parabéns!" en="Congratulations!" />
        ) : (
          <Translate pt="Que pena!" en="Too bad!" />
        )}
      </Typography.Title>
      <Typography.Paragraph>
        {win ? (
          <Translate pt="Você acertou a palavra!" en="You guessed the word!" />
        ) : (
          <Translate pt="Você errou a palavra!" en="You missed the word!" />
        )}
      </Typography.Paragraph>
      <TextHighlight>{<Typography.Paragraph>{text}</Typography.Paragraph>}</TextHighlight>

      <TransparentButton onClick={() => copyToClipboard(result)}>
        <Input.TextArea value={result} readOnly />
      </TransparentButton>

      <Typography.Paragraph>
        <Translate pt="Copie e compartilhe com os amigos" en="Copy and share it with friends" />
      </Typography.Paragraph>
    </Space>
  );
}

function writeResult(challenge: number, hearts: number) {
  let result = '';

  result += '💻 Desafio TD #' + challenge + '\n';
  result +=
    Array(hearts).fill('❤️').join('') +
    Array(3 - hearts)
      .fill('🩶')
      .join('');

  return result;
}
