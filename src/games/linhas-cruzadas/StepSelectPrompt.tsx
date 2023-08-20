// Ant Design Resources
import { Button, Space } from 'antd';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { shuffle } from 'utils/helpers';
// Components

type StepSelectPromptProps = {
  prompts: PromptCard[];
  onSubmitPrompt: (props: SubmitPromptPayload) => void;
};

export function StepSelectPrompt({ prompts, onSubmitPrompt }: StepSelectPromptProps) {
  const { isLoading } = useLoading();

  const onRandomSelect = () => {
    onSubmitPrompt({ promptId: shuffle(prompts.map((prompt) => prompt.id))[0], randomSelection: true });
  };

  // DEV: Auto auto-select
  useMock(onRandomSelect, []);

  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Seleção de Carta" en="Card Selection" />
      </Title>
      <Instruction contained>
        <Translate
          pt="Selecione uma das cartas abaixo a ser usada no jogo"
          en="Select one of the cards below to be used in the game"
        />
      </Instruction>

      <div className="l-cards">
        {prompts.map((prompt) => {
          return (
            <TransparentButton
              key={prompt.id}
              onClick={() => onSubmitPrompt({ promptId: prompt.id })}
              disabled={isLoading}
            >
              <Card>{prompt.text}</Card>
            </TransparentButton>
          );
        })}
      </div>

      <Space className="space-container" align="center">
        <Button onClick={onRandomSelect} disabled={isLoading} ghost>
          <Translate pt="Escolha pra mim" en="Select for me" />
        </Button>
      </Space>
    </Step>
  );
}
