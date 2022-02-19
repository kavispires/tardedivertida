// Design Resources
import { Button } from 'antd';
// Hooks
import { useLoading, useMock } from '../../hooks';
// Utils
import { shuffle } from '../../utils/helpers';
// Components
import { ButtonContainer, Card, Instruction, Step, Title, Translate } from '../../components';

type StepSelectPromptProps = {
  prompts: PromptCard[];
  onSubmitPrompt: GenericFunction;
};

export function StepSelectPrompt({ prompts, onSubmitPrompt }: StepSelectPromptProps) {
  const [isLoading] = useLoading();

  const onRandomSelect = () => {
    onSubmitPrompt({ promptId: shuffle(prompts.map((prompt) => prompt.id))[0] });
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
            <button
              className="reset-button invisible-button"
              key={prompt.id}
              onClick={() => onSubmitPrompt({ promptId: prompt.id })}
              disabled={isLoading}
            >
              <Card>{prompt.text}</Card>
            </button>
          );
        })}
      </div>

      <ButtonContainer>
        <Button onClick={onRandomSelect} disabled={isLoading}>
          <Translate pt="Escolha pra mim" en="Select for me" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
