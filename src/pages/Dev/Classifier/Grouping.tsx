import { Badge, Button, Card, FloatButton, Modal, Popconfirm, Select, Space, Tag, Typography } from 'antd';
import clsx from 'clsx';
import { ItemCard } from 'components/cards/ItemCard';
import { get, orderBy } from 'lodash';
import { useMemo, useState } from 'react';

import { ATTRIBUTES } from './constants';
import { checkCriteria } from './helpers';

import type { Attribute, Weight } from './types';
import { useClassifier } from './ClassifierContext';
import { TransparentButton } from 'components/buttons';
import { useItem } from './hooks';
import { AttributeLevelRadioGroup } from './AttributeLevelRadioGroup';
import { TextHighlight } from 'components/text';
import { SaveFilled, SaveOutlined } from '@ant-design/icons';

const SORTED_ATTRIBUTES = orderBy(Object.values(ATTRIBUTES), ['name.en'], ['asc']);

export function Grouping() {
  const { data, isDirty, isSaving, save, itemUtils } = useClassifier();
  const { itemId, setItemId } = useItem('');
  const [activeAttribute, setActiveAttribute] = useState(SORTED_ATTRIBUTES[0]?.id ?? 'alive');
  const [sorting, setSorting] = useState('id');
  const [criteria, setCriteria] = useState('>1');
  const [show, setShow] = useState('all');

  const itemsList = useMemo(() => {
    return orderBy(
      Object.values(data),
      [(obj) => (sorting === 'id' ? Number(obj.id) : get(obj, sorting))],
      ['asc']
    );
  }, [data, sorting]);

  const selection: BooleanDictionary = useMemo(() => {
    return itemsList.reduce((acc: BooleanDictionary, item) => {
      if (checkCriteria(item, activeAttribute as Attribute, criteria)) {
        acc[item.id] = true;
      }
      return acc;
    }, {});
  }, [itemsList, activeAttribute, criteria]);

  const handleOpenItem = (id: string) => {
    setItemId(id);
  };

  const markAllAsMinusThree = () => {
    itemsList.forEach((item) => {
      if (show === 'selected' && selection[item.id]) {
        itemUtils.updateAttributeValue(item.id, activeAttribute, -3);
      }
    });
  };

  const activeItem = data[itemId];

  return (
    <Space className="container classifier" direction="vertical">
      <Card
        title="Grouping"
        extra={
          <Button
            type="primary"
            onClick={() => save(data)}
            loading={isSaving}
            disabled={isSaving || !isDirty}
          >
            Save
          </Button>
        }
      >
        {isDirty && (
          <FloatButton
            type="primary"
            onClick={!isSaving ? () => save(data) : () => {}}
            shape="square"
            icon={!isSaving ? <SaveFilled /> : <SaveOutlined />}
            tooltip="Save"
          />
        )}

        <Filters
          selection={selection}
          activeAttribute={activeAttribute}
          setActiveAttribute={setActiveAttribute}
          sorting={sorting}
          setSorting={setSorting}
          criteria={criteria}
          setCriteria={setCriteria}
          show={show}
          setShow={setShow}
        />
        {criteria === '0' && show === 'selected' && (
          <Popconfirm title="Are you sure?" onConfirm={markAllAsMinusThree}>
            <Button size="small" type="primary">
              Mark all as -3
            </Button>
          </Popconfirm>
        )}

        <Space wrap>
          {itemsList.map((item) => {
            if (show === 'selected' && !selection[item.id]) {
              return null;
            }

            if (show === 'non-selected' && selection[item.id]) {
              return null;
            }

            return (
              <TransparentButton
                key={item.id}
                className="classifier__grouping-item"
                onClick={() => handleOpenItem(item.id)}
              >
                <Badge count={Number(item.id)} size="small" color="cyan" overflowCount={1000}>
                  <ItemCard
                    id={item.id}
                    width={100}
                    className={clsx(selection[item.id] && 'classifier__active-item')}
                  />
                </Badge>
                <span className="classifier__grouping-name">
                  {typeof item?.name?.en === 'string' ? item?.name?.en : '?'}
                </span>
              </TransparentButton>
            );
          })}
        </Space>

        <Modal
          title="Item Quick Edit"
          open={Boolean(itemId)}
          onCancel={() => setItemId('')}
          okButtonProps={{ style: { display: 'none' } }}
        >
          {Boolean(activeItem) && (
            <div className="quick-edit-modal">
              <ItemCard id={activeItem.id} width={100} />
              <div>
                <Typography.Title level={4}>
                  <TextHighlight>{activeAttribute}</TextHighlight>- {activeItem.name.en || '?'} |{' '}
                  {activeItem.name.pt || '?'} {activeItem.nsfw && <Tag color="magenta">NSFW</Tag>}
                </Typography.Title>
                <AttributeLevelRadioGroup
                  value={activeItem.attributes[activeAttribute as Attribute]}
                  onChange={(e) => {
                    itemUtils.updateAttributeValue(itemId, activeAttribute, e.target.value as Weight);
                    setItemId('');
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </Space>
  );
}

type FiltersProps = {
  selection: BooleanDictionary;
  activeAttribute: string;
  setActiveAttribute: (e: string) => void;
  sorting: string;
  setSorting: (e: string) => void;
  criteria: string;
  setCriteria: (e: string) => void;
  show: string;
  setShow: (e: string) => void;
};

function Filters({
  selection,
  activeAttribute,
  setActiveAttribute,
  sorting,
  setSorting,
  criteria,
  setCriteria,
  show,
  setShow,
}: FiltersProps) {
  return (
    <Space wrap className="margin">
      <Space size="small">
        <span>Attribute</span>
        <Select
          onChange={(e) => setActiveAttribute(e)}
          value={activeAttribute}
          size="small"
          style={{ minWidth: '15ch' }}
        >
          {SORTED_ATTRIBUTES.map((entry) => (
            <Select.Option key={entry.id} value={entry.id}>
              {entry.name.en}
            </Select.Option>
          ))}
        </Select>
      </Space>

      <Space size="small">
        <span>Sorting</span>
        <Select onChange={(e) => setSorting(e)} value={sorting} size="small" style={{ minWidth: '15ch' }}>
          <Select.Option value="id">id</Select.Option>
          <Select.Option value="name.en">name</Select.Option>
        </Select>
      </Space>

      <Space size="small">
        <span>Criteria</span>
        <Select onChange={(e) => setCriteria(e)} value={criteria} size="small" style={{ minWidth: '15ch' }}>
          <Select.Option value=">1">Very Positive</Select.Option>
          <Select.Option value=">0">Positive</Select.Option>
          <Select.Option value="5">5</Select.Option>
          <Select.Option value="3">3</Select.Option>
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="0">Zeroes</Select.Option>
          <Select.Option value="-1">-1</Select.Option>
          <Select.Option value="-3">-3</Select.Option>
          <Select.Option value="-5">-5</Select.Option>
          <Select.Option value="<0>">Negative</Select.Option>
          <Select.Option value="<1>">Very Negative</Select.Option>
        </Select>
      </Space>

      <Space size="small">
        <span>Show</span>
        <Select onChange={(e) => setShow(e)} value={show} size="small" style={{ minWidth: '15ch' }}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="selected">Selected Only</Select.Option>
          <Select.Option value="non-selected">Non-Selected Only</Select.Option>
        </Select>
      </Space>

      <Space size="small">
        <span>Selected</span>
        <Badge count={Object.keys(selection).length} color="cyan" overflowCount={1000} />
      </Space>
    </Space>
  );
}
