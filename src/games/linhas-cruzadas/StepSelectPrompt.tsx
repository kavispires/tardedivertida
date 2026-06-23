// Ant Design Resources
import { RedoOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Utils
import { shuffle } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Card } from '@components/cards/Card';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { Title } from '@components/text/Title';
// Internal
import type { PromptCard, SubmitPromptPayload } from './utils/types';

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
        <Translate
          pt="Seleção de Carta"
          en="Card Selection"
        />
      </Title>
      <RuleInstruction type="action">
        <Translate
          pt="Selecione uma das cartas abaixo a ser usada no jogo"
          en="Select one of the cards below to be used in the game"
        />
      </RuleInstruction>

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

      <SpaceContainer>
        <SendButton
          onClick={onRandomSelect}
          icon={<RedoOutlined />}
          type="dashed"
        >
          <Translate
            pt="Escolha pra mim"
            en="Select for me"
          />
        </SendButton>
      </SpaceContainer>
    </Step>
  );
}
