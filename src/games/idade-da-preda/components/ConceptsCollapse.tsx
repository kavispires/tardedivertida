import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Collapse, Flex, Radio, Typography, type CollapseProps } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useCache } from 'hooks/useCache';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
// Internal
import { useSpriteWidth } from '../utils/useSpriteWidth';
import type { Concept } from '../utils/types';
import { BasicConceptBlock } from './BasicConceptBlock';
import { ConceptCreationBlock } from './ConceptCreationBlock';

type ConceptsCollapseProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: Dictionary<Item>;
  concepts: Concept[];
  basicConcepts?: Concept[];
  onSelectConcept?: (conceptId: string) => void;
  pool?: Item[];
  defaultActiveKey?: ('basic-concepts' | 'concepts' | 'pool')[];
};

export function ConceptsCollapse({
  user,
  players,
  items,
  basicConcepts,
  concepts,
  onSelectConcept,
  pool,
  defaultActiveKey,
}: ConceptsCollapseProps) {
  const itemWidth = useSpriteWidth();

  const collapseItems: CollapseProps['items'] = useMemo(() => {
    const entries = [];

    if (basicConcepts) {
      entries.push({
        key: 'basic-concepts',
        label: <Translate pt="Conceitos Básicos" en="Basic Concepts" />,
        children: (
          <Flex justify="center" align="center" wrap="wrap" gap={6} className="my-2">
            {basicConcepts.map((concept) => (
              <BasicConceptBlock key={concept.id} concept={concept} onSelect={onSelectConcept} />
            ))}
          </Flex>
        ),
      });
    }
    entries.push({
      key: 'concepts',
      label: <Translate pt="Conceitos Criados" en="Created Concepts" />,
      children: (
        <ConceptsContent
          user={user}
          players={players}
          items={items}
          concepts={concepts}
          onSelectConcept={onSelectConcept}
        />
      ),
    });

    if (pool && pool.length > 0) {
      entries.push({
        key: 'pool',
        label: <Translate pt="Itens da Rodada" en="Round's Items" />,
        children: (
          <Flex justify="center" align="center" wrap="wrap" gap={6} className="my-2">
            {pool?.map((item) => (
              <ItemCard key={item.id} id={item.id} width={itemWidth} />
            ))}
          </Flex>
        ),
      });
    }

    return entries;
  }, [basicConcepts, concepts, items, itemWidth, onSelectConcept, players, pool, user]);

  return (
    <div className="full-width contained">
      <Collapse
        items={collapseItems}
        className="full-width"
        size="small"
        defaultActiveKey={defaultActiveKey}
      />
    </div>
  );
}

function ConceptsContent({
  user,
  players,
  items,
  concepts,
  onSelectConcept,
}: Pick<ConceptsCollapseProps, 'user' | 'players' | 'items' | 'concepts' | 'onSelectConcept'>) {
  const [sortBy, setSortBy] = useState('default');
  const { cache } = useCache();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const list = useMemo(() => {
    if (sortBy === 'default') {
      return concepts;
    }
    if (sortBy === 'player') {
      return orderBy(
        concepts,
        (concept) => (concept.playerId === user.id ? 0 : players[concept.playerId]?.name.toLowerCase()),
        ['asc'],
      );
    }
    if (sortBy === 'items') {
      return orderBy(concepts, ['itemsIds.length'], ['desc']);
    }
    if (sortBy === 'notes') {
      return orderBy(
        concepts,
        (concept) => concept.meaning?.toLowerCase() || cache[concept.id].toLowerCase() || '',
        ['asc'],
      );
    }

    return concepts;
  }, [concepts, players, user, onSelectConcept, sortBy, cache]);

  const radioOptions = [
    { label: <Translate pt="Sílaba" en="Syllable" />, value: 'default' },
    { label: <Translate pt="Jogador" en="Player" />, value: 'player' },
    { label: <Translate pt="Itens" en="Items" />, value: 'items' },
    { label: <Translate pt="Anotações" en="Notes" />, value: 'notes' },
  ];

  return (
    <Flex vertical>
      <Flex>
        <Typography.Text>Organizar por:</Typography.Text>
        <Radio.Group
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          options={radioOptions}
          className="ml-2"
        />
      </Flex>
      <Flex justify="center" align="center" wrap="wrap" gap={6} className="my-2">
        {list.map((concept) => (
          <ConceptCreationBlock
            key={concept.id}
            players={players}
            items={items}
            concept={concept}
            user={user}
            onSelect={onSelectConcept}
          />
        ))}
      </Flex>
    </Flex>
  );
}
