// Ant Design Resources
import { AimOutlined } from '@ant-design/icons';
import { Flex, Tag, Tooltip } from 'antd';
// Types
import { Item } from 'types/tdr';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';

type MyThingsProps = {
  hand: string[];
  items: Dictionary<Item>;
  total: number;
};

export function MyThings({ hand = [], items, total }: MyThingsProps) {
  return (
    <Container
      contained
      title={
        <>
          <Translate pt="Suas coisas" en="Your items" />{' '}
          <Tooltip
            title={
              <Translate en="Items to place and total items" pt="Itens para posicionar e total de itens" />
            }
          >
            <Tag bordered={false} icon={<AimOutlined />}>
              {hand.length}/{total}
            </Tag>
          </Tooltip>
        </>
      }
      contentProps={{ direction: 'vertical' }}
    >
      <Translate
        pt="Essas são as suas coisas que você poderá posicionar quando chegar sua vez."
        en="These are your items that you will be able to place when it's your turn."
      />

      <ViewOr condition={hand.length > 0}>
        <Flex gap={8} justify="center">
          {hand.map((itemId: string) => (
            <ItemCard key={itemId} id={itemId} width={100} text={items[itemId]?.name} />
          ))}
        </Flex>

        <p>
          <Translate en="You don't have any items yet" pt="Você ainda não tem itens." />
        </p>
      </ViewOr>
    </Container>
  );
}
