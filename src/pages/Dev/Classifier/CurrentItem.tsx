import { Divider, Input, Space, Switch, Typography } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { useMemo } from 'react';

import { determineAttributePriorityResponse } from './bot-utils';

import type { ItemId, AlienItem } from './types';
import { Sign } from './Sign';

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
  const attributePriority = useMemo(
    () => determineAttributePriorityResponse([itemId], { [itemId]: activeItem }),
    [itemId, activeItem]
  );
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
      <Divider />

      <Typography.Paragraph strong className="center">
        Response Priority
      </Typography.Paragraph>

      {attributePriority.map((attributeId) => (
        <Sign attribute={attributeId} key={attributeId} />
      ))}
    </Space>
  );
}
