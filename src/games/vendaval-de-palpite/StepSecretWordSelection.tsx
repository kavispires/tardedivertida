import { useState } from 'react';
// Ant Design Resources
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, App } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { Instruction, Title, StepTitle } from 'components/text';

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
          title: (
            <Translate
              pt="Um máximo de 2 categorias é permitido"
              en="Up to 2 categories allowed"
            />
          ),
        });
      } else {
        categoriesCopy[category] = true;
      }
    }

    setSelectedCategories(categoriesCopy);
  };

  return (
    <Step key={1}>
      <StepTitle>
        <Translate
          pt="A Palavra Secreta"
          en="The Secret Word"
        />
      </StepTitle>
      <Instruction contained>
        <Translate
          pt="Escolha a palavra secreta para os outros jogadores tentarem adivinhar e então selecione uma ou duas categorias que melhor se encaixam com a palavra escolhida"
          en="Select a secret word so the other players can guess, then select up to 2 categories that best match the clue"
        />
      </Instruction>

      <SpaceContainer wrap>
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
      </SpaceContainer>

      <Title
        level={3}
        size="x-small"
      >
        <Translate
          pt="Categorias"
          en="Categories"
        />
      </Title>

      <Instruction contained>
        <SpaceContainer wrap>
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
        </SpaceContainer>
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
        <Translate
          pt="Enviar "
          en="Submit "
        />
        {isReadyToSend && (
          <span>
            "{secretWord}" + {Object.keys(selectedCategories).join(', ')}
          </span>
        )}
      </Button>
    </Step>
  );
}
