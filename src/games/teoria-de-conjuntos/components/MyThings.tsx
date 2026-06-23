// Ant Design Resources
import { AimOutlined } from '@ant-design/icons';
import { Flex, Tag, Tooltip } from 'antd';
// Types
import type { ItemData } from 'types/tdr';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { ViewIf } from '@components/views/ViewIf';

type MyThingsProps = {
  hand: string[];
  items: Dictionary<ItemData>;
  total: number;
};

export function MyThings({ hand = [], items, total }: MyThingsProps) {
  return (
    <TitledContainer
      contained
      title={
        <>
          <Translate
            pt="Suas coisas"
            en="Your items"
          />{' '}
          <Tooltip
            title={
              <Translate
                en="Items to place and total items"
                pt="Itens para posicionar e total de itens"
              />
            }
          >
            <Tag
              variant="solid"
              icon={<AimOutlined />}
            >
              {hand.length}/{total}
            </Tag>
          </Tooltip>
        </>
      }
      contentProps={{ orientation: 'vertical' }}
    >
      <Translate
        pt="Essas são as suas coisas que você poderá posicionar quando chegar sua vez."
        en="These are your items that you will be able to place when it's your turn."
      />

      <ViewIf condition={hand.length > 0}>
        <Flex
          gap={8}
          justify="center"
        >
          {hand.slice(0, 10).map((itemId: string) => (
            <ItemCard
              key={itemId}
              itemId={itemId}
              width={100}
              text={items[itemId]?.name}
            />
          ))}
        </Flex>
      </ViewIf>
      <ViewIf condition={hand.length === 0}>
        <p>
          <Translate
            en="You don't have any items yet"
            pt="Você ainda não tem itens."
          />
        </p>
      </ViewIf>
    </TitledContainer>
  );
}
