import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Tag } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { CollapsibleRule } from '@components/rules/CollapsibleRule';
// Internal
import type { FestaJuninaCard } from '../utils/types';
import { FestaJuninaCardImage } from './FestaJuninaCardImage';

type DeckExplanationProps = {
  cardsDict: Dictionary<FestaJuninaCard>;
  cardWidth: number;
};

export function DeckExplanation({ cardsDict, cardWidth }: DeckExplanationProps) {
  const cards = useMemo(() => Object.values(cardsDict).filter((c) => c.count > 0), [cardsDict]);

  return (
    <CollapsibleRule
      ruleInstructionProps={{ type: 'tip' }}
      title={
        <Translate
          en="See all the cards in the game"
          pt="Espiar todas as cartas do jogo"
        />
      }
    >
      <Flex
        wrap
        gap={16}
        justify="center"
      >
        {cards.map((card) => (
          <Flex
            vertical
            key={card.id}
          >
            <FestaJuninaCardImage
              card={card}
              cardId={card.id}
              width={cardWidth / 1.5}
            />
            <Flex justify="center">
              <Tag>{card.count}×</Tag>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </CollapsibleRule>
  );
}
