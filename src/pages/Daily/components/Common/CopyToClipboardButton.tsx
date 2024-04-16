import { App } from 'antd';
import { TransparentButton } from 'components/buttons';
import { useLanguage } from 'hooks/useLanguage';
import { ReactNode, useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

type CopyToClipboardButtonProps = {
  content: string;
  children: ReactNode;
};

export function CopyToClipboardButton({ content, children }: CopyToClipboardButtonProps) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const [state, copyToClipboard] = useCopyToClipboard();

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

  return <TransparentButton onClick={() => copyToClipboard(content)}>{children}</TransparentButton>;
}
