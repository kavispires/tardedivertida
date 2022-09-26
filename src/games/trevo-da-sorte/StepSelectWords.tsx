import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { WORST_TO_REMOVE } from './utils/constants';
import { mockSelectCards } from './utils/mock';
// Components
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StepSelectWordsProps = {
  hand: TextCard[];
  onSubmitBadWords: GenericFunction;
};

export function StepSelectWords({ hand, onSubmitBadWords }: StepSelectWordsProps) {
  const { isLoading } = useLoading();
  const alphabeticalHand = useMemo(() => orderBy(hand, 'text'), [hand]);

  const [selectedCards, updateSelectedCard] = useBooleanDictionary({});

  const onSubmit = () => {
    onSubmitBadWords({ cardsIds: Object.keys(selectedCards) });
  };
  const onSubmitMock = () => {
    onSubmitBadWords({ cardsIds: mockSelectCards(hand) });
  };

  useMock(() => {
    onSubmitBadWords({ cardsIds: mockSelectCards(hand) });
  });

  const selectedCount = Object.keys(selectedCards).length;
  const isComplete = selectedCount === WORST_TO_REMOVE;

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Seleção das Palavras" en="Words Selection" />
      </Title>
      <Instruction contained>
        <Translate
          pt={`Selecione ${WORST_TO_REMOVE} palavras que você NÃO quer no jogo`}
          en={`Select ${WORST_TO_REMOVE} words you DO NOT want in the game`}
        />
      </Instruction>

      <ul className="y-words-list">
        {alphabeticalHand.map((card) => (
          <li className={clsx('y-words-list__word')} key={card.id}>
            <TransparentButton
              onClick={() => updateSelectedCard(card.id)}
              active={selectedCards[card.id]}
              activeClass="y-words-list__word-selected"
            >
              {card.text}
            </TransparentButton>
          </li>
        ))}
      </ul>

      <Space className="space-container" align="center">
        <Button type="primary" size="large" onClick={onSubmit} disabled={!isComplete || isLoading}>
          <Translate
            pt={<>Enviar Palavras ({selectedCount} de 6)</>}
            en={<>Submit Words ({selectedCount} of 6)</>}
          />
        </Button>

        <Button size="large" onClick={onSubmitMock}>
          <Translate pt="Selecione pra mim" en="Select for me" />
        </Button>
      </Space>
    </Step>
  );
}
