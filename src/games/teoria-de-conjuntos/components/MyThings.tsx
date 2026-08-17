import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { ItemData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Translate } from '@components/language/Translate';
import { Title } from '@components/text/Title';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { ThingsCountHighlight } from './Highlights';
import { Thing } from './Thing';

type MyThingsProps = {
  hand: string[];
  items: Dictionary<ItemData>;
  total: number;
  maxHeight?: number;
  activeItemId?: string | null;
  onClick?: (itemId: string) => void;
  disabled?: boolean;
};

export function MyThings({
  hand = [],
  items,
  total,
  maxHeight,
  activeItemId,
  onClick,
  disabled,
}: MyThingsProps) {
  const { translate } = useLanguage();
  return (
    <>
      <Title
        size="xx-small"
        colorScheme="light"
      >
        <Translate
          pt="Suas coisas"
          en="Your items"
        />
      </Title>

      <div>
        <ThingsCountHighlight>
          {(hand ?? []).slice(0, 10).length}/{total}
        </ThingsCountHighlight>
      </div>

      <ViewIf condition={hand.length > 0}>
        <Space
          size="small"
          vertical
          className="my-hand-limit"
          style={{ maxHeight }}
        >
          {hand.slice(0, 10).map((itemId: string) =>
            onClick ? (
              <TransparentButton
                key={itemId}
                onClick={() => onClick(itemId)}
                active={itemId === activeItemId}
              >
                <Thing
                  key={itemId}
                  itemId={itemId}
                  name={translate(items[itemId].name)}
                  className={clsx({ 'my-hand-disabled': disabled })}
                />
              </TransparentButton>
            ) : (
              <Thing
                key={itemId}
                itemId={itemId}
                name={translate(items[itemId].name)}
                className={clsx({ 'my-hand-disabled': disabled })}
              />
            ),
          )}
        </Space>
      </ViewIf>
      <ViewIf condition={hand.length === 0}>
        <p>
          <Translate
            en="You don't have any items"
            pt="Você ainda não tem itens."
          />
        </p>
      </ViewIf>
    </>
  );
}
