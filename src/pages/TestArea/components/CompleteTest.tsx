import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';
// Ant Design Resources
import { Button, Input, Space, App } from 'antd';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { TestStepProps } from '../TestArea';

export function CompleteTest({ results }: TestStepProps) {
  const { message } = App.useApp();
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.value) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, message]);

  const result = `Tarde Divertida Test:\n${(results ?? []).map((r) => (r ? `✅` : `❌`)).join('')}`;

  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Pronto!" en="Done!" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Compartilhe com quem te pediu para fazer o teste o resultado abaixo caso você tenha tipo algum resultado negativo."
          en="Share the result below with whoever asked you to take this test if you had any negative results."
        />
      </Instruction>

      <Space wrap className="space-container full-width" direction="vertical">
        <Input.TextArea readOnly value={result} cols={30}></Input.TextArea>
        <Button type="primary" onClick={() => copyToClipboard(result)}>
          <Translate pt="Copiar" en="Copy" />
        </Button>
      </Space>
    </Space>
  );
}
