import { Card, Space } from 'antd';
import { Loading } from 'components/loaders';
import { useQueryParams } from 'hooks/useQueryParams';
import { isEmpty, orderBy } from 'lodash';
import { useEffect } from 'react';

import { AttributeLevelRadioGroup } from './AttributeLevelRadioGroup';
import { useClassifier } from './ClassifierContext';
import { ATTRIBUTES } from './constants';
import { Controls } from './Controls';
import { CurrentItem } from './CurrentItem';
import { countNonZeroAttributes, initialAttributeState, validateItem } from './helpers';
import { useItem } from './hooks';
import { Search } from './Search';
import { Verifier } from './Verifier';

import type { Attribute, Weight } from './types';
const attributeList = orderBy(Object.values(ATTRIBUTES), ['name.en'], ['asc']);

export function ClassifyingCard() {
  const { data, save, isSaving, itemUtils, isDirty, isSuccess } = useClassifier();
  const { itemId, previousItem, nextItem, itemNumber, goTo, setItemId } = useItem(itemUtils.incompleteId);
  const qp = useQueryParams();

  const current = data[itemId];

  useEffect(() => {
    if (isSuccess && !isEmpty(data) && !current) {
      itemUtils.create(itemId);
    }
  }, [current, isSuccess]); // eslint-disable-line

  useEffect(() => {
    if (qp.queryParams.item) {
      setItemId(qp.queryParams.item);
    }
  }, [qp.queryParams.item]); // eslint-disable-line

  const updateNameEN = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemUtils.updateNameEN(itemId, e.target.value.toLowerCase());
  };

  const updateNamePT = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemUtils.updateNamePT(itemId, e.target.value.toLowerCase());
  };

  const updateAttributeValue = (attributeId: string, value: number) => {
    itemUtils.updateAttributeValue(itemId, attributeId, value as Weight);
  };

  const updateNSFW = (value: boolean) => {
    itemUtils.updateNSFW(itemId, value);
  };

  const updateCategory = (value: string[]) => {
    itemUtils.updateCategory(itemId, value);
  };

  if (!current) {
    return (
      <Space className="space-container">
        <Loading />
      </Space>
    );
  }

  const validation = validateItem(current, initialAttributeState);

  const currentItemComponent = (
    <CurrentItem
      itemId={itemId}
      activeItem={current}
      updateNameEN={updateNameEN}
      updateNamePT={updateNamePT}
      updateNSFW={updateNSFW}
      updateCategory={updateCategory}
    />
  );

  const controls = (
    <Controls
      itemId={itemId}
      itemNumber={itemNumber}
      previousItem={previousItem}
      nextItem={nextItem}
      goTo={goTo}
      isSaving={isSaving}
      save={save}
      latestId={itemUtils.latestId}
      data={data}
      isDirty={isDirty}
    />
  );

  return (
    <Space className="container classifier" direction="vertical">
      {controls}

      <Card
        title={
          <>
            Classifying {itemId} - {current.name.en.toUpperCase()} - ({countNonZeroAttributes(current)}/
            {attributeList.length})
          </>
        }
        extra={<Search setItemId={setItemId} data={data} />}
      >
        <Space className="classifier__grid">
          <div>{currentItemComponent}</div>

          <Space className="classifier__attributes" wrap>
            {attributeList.map((entry) => {
              return (
                <Space className="classifier__entry" direction="vertical" key={entry.id}>
                  <div className="title">{`${entry.name.en} - ${entry.name.pt}`}</div>
                  <AttributeLevelRadioGroup
                    value={current.attributes[entry.id as Attribute]}
                    onChange={(e) => updateAttributeValue(entry.id, e.target.value)}
                  />
                </Space>
              );
            })}
          </Space>

          {currentItemComponent}
        </Space>
        <Space className="classifier__verifiers space-container">
          <span></span>
          <Verifier label="Has name" value={validation.hasName} />
          <Verifier label="Has no zeroes" value={validation.hasNoZeroes} />
          <Verifier label="Has positive values" value={validation.hasPositive} />
          <Verifier label="Has at least one 5" value={validation.hasFive} />
        </Space>
      </Card>

      {controls}
    </Space>
  );
}
