import { Input, Space, Switch } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';

import type { ItemId, AlienItem } from './types';

type CurrentItemsProps = {
  itemId: ItemId;
  updateName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeItem: AlienItem;
};

export function CurrentItem({ itemId, updateName, activeItem }: CurrentItemsProps) {
  return (
    <Space className="classifier__item" direction="vertical">
      <Input placeholder="Type name" onChange={updateName} value={activeItem.name} />
      <ItemCard id={itemId} width={100} />
      <Switch checkedChildren="NSFW" unCheckedChildren="SFW" />
    </Space>
  );
}
