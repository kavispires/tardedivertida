import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';
// Ant Design Resources
import { App, Input, Typography } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';

type CopyToClipboardResultProps = {
  result: string;
  rows?: number;
};

export function CopyToClipboardResult({ result, rows = 4 }: CopyToClipboardResultProps) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.value) {
      message.info(
        translate({
          pt: `Copiado para a área de transferência: ${state.value}`,
          en: `Copied to clipboard: ${state.value}`,
        }),
      );
    }
  }, [state, message, translate]);

  return (
    <SpaceContainer vertical>
      <Typography.Paragraph
        className="center"
        style={{ marginBottom: 0 }}
      >
        <Translate
          pt="Compartilhe com os amigos:"
          en="Share it with friends:"
        />
      </Typography.Paragraph>
      <TransparentButton onClick={() => copyToClipboard(result)}>
        <Input.TextArea
          value={result}
          readOnly
          cols={30}
          rows={rows}
        />
      </TransparentButton>
    </SpaceContainer>
  );
}
