import { useMemo } from 'react';
// Ant Design Resources
import { Button, Flex, Popover } from 'antd';
// Hooks
import { useCache } from 'hooks/useCache';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { TextHighlight } from 'components/text/TextHighlight';
import { type AlienAttribute, alienAttributesUtils } from 'components/toolKits/AlienAttributes';
// Internal
import type { PhaseBasicState } from '../utils/types';

type InquirySuggestionsProps = {
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  setAttribute: (attributeId: string) => void;
  setSelected: (selected: Dictionary<boolean>) => void;
};

export function InquirySuggestions({
  items,
  attributes,
  startingAttributesIds,
  setAttribute,
  setSelected,
}: InquirySuggestionsProps) {
  const { cache } = useCache<Dictionary<string>>({});

  const suggestions = useMemo(() => {
    return alienAttributesUtils.getInquirySuggestions(items, attributes, [
      ...startingAttributesIds,
      ...Object.keys(cache),
    ]);
  }, [items, attributes, startingAttributesIds, cache]);

  const content = (
    <>
      <p style={{ maxWidth: 256 }}>
        <Translate
          en="This feature uses the attributes you've been taking note of during the game."
          pt="Essa funcionalidade utiliza os atributos que você tem anotado durante o jogo."
        />
      </p>

      <ul className="inquiry-suggestions-list">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.attribute.id}
            className="inquiry-suggestions-list__item"
          >
            <TextHighlight>
              <DualTranslate>{suggestion.attribute.name}</DualTranslate>
            </TextHighlight>
            <Flex gap={3}>
              {suggestion.items.map((item) => (
                <ItemCard
                  key={item.id}
                  itemId={item.id}
                  width={36}
                  padding={2}
                />
              ))}
            </Flex>
            <Button
              size="small"
              onClick={() => {
                setAttribute(suggestion.attribute.id);
                setSelected(
                  suggestion.items.reduce(
                    (acc, item) => {
                      acc[item.id] = true;
                      return acc;
                    },
                    {} as Dictionary<boolean>,
                  ),
                );
              }}
              shape="round"
            >
              <Translate
                pt="Usar"
                en="Use"
              />
            </Button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <Popover
      content={content}
      title={
        <Translate
          pt="Sugestões de Pergunta"
          en="Ask Suggestions"
        />
      }
    >
      <Button
        size="large"
        ghost
      >
        <Translate
          pt="Sugestões?"
          en="Suggestions?"
        />
      </Button>
    </Popover>
  );
}

type AnswerSuggestionsProps = {
  attributesDict: Dictionary<AlienAttribute>;
  suggestions: string[];
  onSelect: (spriteId: string) => void;
};

export function AnswerSuggestions({ attributesDict, suggestions, onSelect }: AnswerSuggestionsProps) {
  const content = (
    <ul>
      {suggestions.map((suggestionId) => {
        const suggestion = attributesDict[suggestionId];

        if (!suggestion) return null;

        return (
          <li
            key={suggestionId}
            className="my-1"
          >
            <Flex
              align="center"
              gap={8}
            >
              <TextHighlight>
                <DualTranslate>{suggestion.name}</DualTranslate>
              </TextHighlight>
              <SignCard
                signId={`${suggestion.spriteId}`}
                className="transparent"
                width={36}
              />
              <Button
                size="small"
                onClick={() => onSelect(suggestion.spriteId)}
                shape="round"
              >
                <Translate
                  pt="Usar"
                  en="Use"
                />
              </Button>
            </Flex>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Popover
      content={content}
      title={
        <Translate
          pt="Sugestões de Resposta"
          en="Answer Suggestions"
        />
      }
    >
      <Button
        ghost
        shape="round"
        size="small"
      >
        <Translate
          pt="Sugestões?"
          en="Suggestions?"
        />
      </Button>
    </Popover>
  );
}
