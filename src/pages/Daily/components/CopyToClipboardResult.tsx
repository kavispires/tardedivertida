import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';
// Ant Design Resources
import { App, Input, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';

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
        translate(
          `Copiado para a área de transferência: ${state.value}`,
          `Copied to clipboard: ${state.value}`,
        ),
      );
    }
  }, [state, message, translate]);

  return (
    <SpaceContainer vertical fullWidth>
      <TransparentButton onClick={() => copyToClipboard(result)}>
        <Input.TextArea value={result} readOnly cols={30} rows={rows} />
      </TransparentButton>

      <Typography.Paragraph className="center">
        <Translate
          pt="Clique no campo acima para copiar e compartilhe com os amigos"
          en="Click the field above to copy and share it with friends"
        />
      </Typography.Paragraph>
    </SpaceContainer>
  );
}
