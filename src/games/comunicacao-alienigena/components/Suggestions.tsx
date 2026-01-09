import { useMemo } from 'react';
// Ant Design Resources
import { Button, Flex, Popover } from 'antd';
// Hooks
import { useCache } from 'hooks/useCache';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { TextHighlight } from 'components/text';
import { alienAttributesUtils } from 'components/toolKits/AlienAttributes';
// Internal
import type { PhaseAlienAnswerState, PhaseBasicState } from '../utils/types';

type InquirySuggestionsProps = {
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
};

export function InquirySuggestions({ items, attributes, startingAttributesIds }: InquirySuggestionsProps) {
  const { cache } = useCache();

  const suggestions = useMemo(() => {
    return alienAttributesUtils.getInquirySuggestions(items, attributes, [
      ...startingAttributesIds,
      ...Object.keys(cache),
    ]);
  }, [items, attributes, startingAttributesIds, cache]);

  const content = (
    <ul>
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.attribute.id}
          className="my-1"
        >
          <Flex
            align="center"
            gap={8}
          >
            <TextHighlight>
              <DualTranslate>{suggestion.attribute.name}</DualTranslate>
            </TextHighlight>
            {suggestion.items.map((item) => (
              <ItemCard
                key={item.id}
                itemId={item.id}
                width={36}
                padding={2}
              />
            ))}
          </Flex>
        </li>
      ))}
    </ul>
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
      <Button type="link">
        <Translate
          pt="Sugestões?"
          en="Suggestions?"
        />
      </Button>
    </Popover>
  );
}

type AnswerSuggestionsProps = {
  suggestions: PhaseAlienAnswerState['suggestions'];
};

export function AnswerSuggestions({ suggestions }: AnswerSuggestionsProps) {
  const content = (
    <ul>
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.id}
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
          </Flex>
        </li>
      ))}
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
      <Button type="link">
        <Translate
          pt="Ajuda?"
          en="Help?"
        />
      </Button>
    </Popover>
  );
}
