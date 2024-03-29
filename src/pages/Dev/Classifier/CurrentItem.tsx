import { Checkbox, Divider, Input, Space, Switch, Typography } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { useMemo } from 'react';

import { determineAttributePriorityResponse } from './bot-utils';

import type { ItemId, AlienItem } from './types';
import { Sign } from './Sign';
import { CATEGORIES } from './constants';

type CurrentItemsProps = {
  itemId: ItemId;
  updateNameEN: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateNamePT: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeItem: AlienItem;
  updateNSFW: any;
  updateCategory: any;
};

export function CurrentItem({
  itemId,
  updateNameEN,
  updateNamePT,
  activeItem,
  updateNSFW,
  updateCategory,
}: CurrentItemsProps) {
  const attributePriority = useMemo(
    () => determineAttributePriorityResponse([itemId], { [itemId]: activeItem }),
    [itemId, activeItem]
  );

  return (
    <Space className="classifier__item" direction="vertical" styles={{ item: { width: '100%' } }}>
      <Input placeholder="Type name" onChange={updateNameEN} value={activeItem.name.en} />
      <Input placeholder="Type nome" onChange={updateNamePT} value={activeItem.name.pt} />
      <ItemCard id={itemId} width={100} />
      <Switch
        checkedChildren="NSFW"
        unCheckedChildren="SFW"
        onChange={updateNSFW}
        checked={activeItem?.nsfw}
      />

      {/* <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Categories"
        value={activeItem?.categories ?? []}
        onChange={updateCategory}
        options={CATEGORIES}
      /> */}

      <CategoryBoxes updateCategory={updateCategory} activeItem={activeItem} />

      <Divider />

      <Typography.Paragraph strong className="center">
        Response Priority
      </Typography.Paragraph>

      {attributePriority.map(({ attribute, value }) => {
        return <Sign attribute={attribute} key={attribute} very={value === 5} not={value === -5} />;
      })}
    </Space>
  );
}

type CategoryBoxesProps = {
  updateCategory: any;
  activeItem: AlienItem;
};

function CategoryBoxes({ updateCategory, activeItem }: CategoryBoxesProps) {
  const handleUpdateCategory = (checked: boolean, category: string) => {
    if (checked) {
      updateCategory([...(activeItem.categories ?? []), category]);
    } else {
      updateCategory((activeItem.categories ?? []).filter((c: string) => c !== category));
    }
  };

  return (
    <ul className="category-container">
      {CATEGORIES.map((category) => {
        return (
          <li key={category.value}>
            <Checkbox
              onChange={(event) => handleUpdateCategory(event.target.checked, category.value)}
              checked={activeItem?.categories?.includes(category.value)}
            >
              {category.label}
            </Checkbox>
          </li>
        );
      })}
    </ul>
  );
}
