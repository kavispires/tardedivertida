import { Input, Space, Switch } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';

import type { ItemId, AlienItem } from './types';

type CurrentItemsProps = {
  itemId: ItemId;
  updateNameEN: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateNamePT: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeItem: AlienItem;
  updateNSFW: any;
};

export function CurrentItem({
  itemId,
  updateNameEN,
  updateNamePT,
  activeItem,
  updateNSFW,
}: CurrentItemsProps) {
  console.log({ activeItem });
  return (
    <Space className="classifier__item" direction="vertical">
      <Input placeholder="Type name" onChange={updateNameEN} value={activeItem.name.en} />
      <Input placeholder="Type nome" onChange={updateNamePT} value={activeItem.name.pt} />
      <ItemCard id={itemId} width={100} />
      <Switch
        checkedChildren="NSFW"
        unCheckedChildren="SFW"
        onChange={updateNSFW}
        checked={activeItem?.nsfw}
      />
    </Space>
  );
}
