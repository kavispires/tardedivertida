// Ant Design Resources
import { Badge, Button, Flex } from 'antd';
// Types
import type { Item } from 'types/tdr';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language/Translate';
import { RuleInstruction } from 'components/text';
// Internal
import { ThingCard } from './ThingCard';
import { ThingHighlight } from './Highlights';

type ItemHandProps = {
  hand: string[];
  cardsDict: Dictionary<Item>;
  onSelectItem?: (itemId: string) => void;
  selectedItemsIds?: string[];
  hideCount?: boolean;
};

export function ItemsHand({
  hand,
  cardsDict,
  onSelectItem,
  selectedItemsIds = [],
  hideCount = false,
}: ItemHandProps) {
  return (
    <Flex
      vertical
      align="center"
    >
      <Flex
        wrap="wrap"
        gap={12}
        justify="center"
        className="contained"
      >
        {hand.map((itemId: string) => (
          <Flex
            key={itemId}
            orientation="vertical"
            gap={4}
            align="center"
          >
            {onSelectItem && (
              <div style={{ textAlign: 'center' }}>
                <Button
                  size="small"
                  shape="round"
                  onClick={() => onSelectItem?.(itemId)}
                >
                  {selectedItemsIds.includes(itemId) ? (
                    <Translate
                      pt="Desmarcar"
                      en="Deselect"
                    />
                  ) : (
                    <Translate
                      pt="Usar"
                      en="Use"
                    />
                  )}
                </Button>
              </div>
            )}
            {onSelectItem ? (
              <TransparentButton onClick={() => onSelectItem?.(itemId)}>
                <Badge
                  count={selectedItemsIds.indexOf(itemId) + 1}
                  offset={[0, 0]}
                >
                  <ThingCard
                    itemId={itemId}
                    name={cardsDict[itemId].name}
                    width={100}
                  />
                </Badge>
              </TransparentButton>
            ) : (
              <Badge
                count={selectedItemsIds.indexOf(itemId) + 1}
                offset={[0, 0]}
              >
                <ThingCard
                  itemId={itemId}
                  name={cardsDict[itemId].name}
                  width={100}
                />
              </Badge>
            )}
          </Flex>
        ))}
      </Flex>
      {!hideCount && (
        <RuleInstruction type="tip">
          <Translate
            pt={
              <>
                Você ainda tem <ThingHighlight>{hand.length}</ThingHighlight>{' '}
                {pluralize(hand.length, 'coisa')} na mão.
              </>
            }
            en={
              <>
                You still have <ThingHighlight>{hand.length}</ThingHighlight>{' '}
                {pluralize(hand.length, 'thing')} in your hand.
              </>
            }
          />
        </RuleInstruction>
      )}
    </Flex>
  );
}
