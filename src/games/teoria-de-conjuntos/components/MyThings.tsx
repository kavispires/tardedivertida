import { Flex } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { Item } from 'types/tdr';

type MyThingsProps = {
  hand: string[];
  items: Dictionary<Item>;
};

export function MyThings({ hand, items }: MyThingsProps) {
  return (
    <Container
      contained
      title={<Translate pt="Suas coisas" en="Your items" />}
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
