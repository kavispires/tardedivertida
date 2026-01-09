import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Card, Divider, Flex, Typography } from 'antd';
// Components
import { SpeakButton } from 'components/audio/SpeakButton';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { SlideShowLabel } from 'components/slide-show';
import { TextHighlight } from 'components/text';
// Internal
import type { Concept, GalleryEntry } from '../utils/types';
import { useSpriteWidth } from '../utils/useSpriteWidth';
import { BASIC_CONCEPTS_TRANSLATIONS } from '../utils/constants';

type DefinitionPageProps = {
  entry: GalleryEntry;
  basicConcepts: Concept[];
  concepts: Concept[];
};

export function DefinitionPage({ entry, basicConcepts, concepts }: DefinitionPageProps) {
  const selectedConcepts = useMemo(() => {
    return entry.conceptsIds
      .map((id) => {
        return basicConcepts.find((c) => c.id === id) || concepts.find((c) => c.id === id);
      })
      .filter(Boolean) as Concept[];
  }, [entry.conceptsIds, basicConcepts, concepts]);

  return (
    <div className="full-width">
      <Flex
        align="center"
        gap={12}
      >
        <div>
          <span className="idp-gallery__letter">{entry.name[0]}</span>
        </div>

        <ItemCard
          itemId={entry.itemId}
          width={64}
        />

        <div>
          <SlideShowLabel>
            <Translate
              pt="Nome"
              en="Name"
            />
          </SlideShowLabel>

          <Flex
            align="center"
            gap={6}
          >
            <TextHighlight className="idp-item-name">{entry.name}</TextHighlight>
            <SpeakButton text={{ en: entry.name, pt: entry.name }} />
          </Flex>
        </div>
      </Flex>

      <Divider className="my-4" />

      <SlideShowLabel>
        <Translate
          pt="Definição"
          en="Definition"
        />
      </SlideShowLabel>
      <Flex
        wrap="wrap"
        gap={6}
        className="my-2"
      >
        {selectedConcepts.map((concept) => (
          <SimplifiedConcept
            key={concept.id}
            concept={concept}
          />
        ))}
      </Flex>
    </div>
  );
}

type SimplifiedConceptProps = {
  concept: Concept;
};

function SimplifiedConcept({ concept }: SimplifiedConceptProps) {
  const itemWidth = useSpriteWidth();
  return (
    <Card size="small">
      <div className={clsx('concept-block__syllable')}>
        <DualTranslate>{concept.syllable}</DualTranslate>
        <Flex
          wrap="wrap"
          gap={3}
        >
          {concept.type === 'basic' && (
            <Typography.Text italic>
              <DualTranslate>{BASIC_CONCEPTS_TRANSLATIONS[concept.key]}</DualTranslate>
            </Typography.Text>
          )}
          {concept.itemsIds.slice(-3).map((itemId) => (
            <ItemCard
              key={`${concept.id}-${itemId}`}
              width={itemWidth / 2}
              itemId={itemId}
            />
          ))}
        </Flex>
      </div>
    </Card>
  );
}
