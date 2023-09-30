// Ant Design Resources
import { Button, App, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { useState } from 'react';
import { Card } from 'components/cards';
import { CheckCircleFilled } from '@ant-design/icons';

type StepSecretWordSelectionProps = {
  words: TextCard[];
  categories: TextCard[];
  onSubmitSecretWord: GenericFunction;
};

export function StepSecretWordSelection({
  words,
  categories,
  onSubmitSecretWord,
}: StepSecretWordSelectionProps) {
  const { notification } = App.useApp();
  const { isLoading } = useLoading();
  const [secretWord, setSecretWord] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<BooleanDictionary>({});
  const isReadyToSend = Boolean(secretWord && Object.keys(selectedCategories).length > 0);

  const handleCategoryAdd = (category: string) => {
    const categoriesCopy: BooleanDictionary = { ...selectedCategories };
    if (categoriesCopy[category]) {
      delete categoriesCopy[category];
    } else {
      // Block more than 2 categories
      if (Object.keys(categoriesCopy).length === 2) {
        notification.error({
          message: <Translate pt="Um máximo de 2 categorias é permitido" en="Up to 2 categories allowed" />,
        });
      } else {
        categoriesCopy[category] = true;
      }
    }

    setSelectedCategories(categoriesCopy);
  };

  return (
    <Step key={1}>
      <Title size="medium">
        <Translate pt="A Palavra Secreta" en="The Secret Word" />
      </Title>
      <Instruction contained>
        <Translate
          pt="Escolha a palavra secreta para os outros jogadores tentarem adivinhar e então selecione uma ou duas categorias que melhor se encaixam com a palavra escolhida"
          en="Select a secret word so the other players can guess, then select up to 2 categories that best match the clue"
        />
      </Instruction>

      <Space wrap className="space-container" align="center">
        {words.map((word) => {
          return (
            <TransparentButton
              key={`p-bt-${word.id}`}
              disabled={isLoading}
              onClick={() => setSecretWord(word.text)}
              active={secretWord === word.text}
            >
              <Card>{word.text}</Card>
            </TransparentButton>
          );
        })}
      </Space>

      <Title level={3} size="x-small">
        <Translate pt="Categorias" en="Categories" />
      </Title>

      <Instruction contained>
        <Space wrap className="space-container" align="center">
          {categories.map((category) => {
            return (
              <Button
                key={`p-bt-${category.id}`}
                disabled={isLoading || !secretWord}
                onClick={() => handleCategoryAdd(category.text)}
                className="v-secret-word-button"
              >
                {selectedCategories[category.text] && <CheckCircleFilled />} {category.text}
              </Button>
            );
          })}
        </Space>
      </Instruction>

      <Button
        type="primary"
        disabled={!isReadyToSend}
        onClick={() =>
          onSubmitSecretWord({
            secretWord,
            categories: Object.keys(selectedCategories),
          })
        }
      >
        <Translate pt="Enviar " en="Submit " />
        {isReadyToSend && (
          <span>
            "{secretWord}" + {Object.keys(selectedCategories).join(', ')}
          </span>
        )}
      </Button>
    </Step>
  );
}
