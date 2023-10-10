import { Badge, Card, Select, Space } from 'antd';
import clsx from 'clsx';
import { ItemCard } from 'components/cards/ItemCard';
import { get, orderBy } from 'lodash';
import { useMemo, useState } from 'react';

import { ATTRIBUTES } from './constants';
import { checkCriteria } from './helpers';
import { UseAlienItemDocumentReturnValue } from './hooks';

import type { Attribute } from './types';

type GroupingProps = Pick<UseAlienItemDocumentReturnValue, 'data'>;

export function Grouping({ data }: GroupingProps) {
  const attributesList = Object.values(ATTRIBUTES);
  const [activeAttribute, setActiveAttribute] = useState(attributesList[0]?.id ?? 'alive');
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

  return (
    <Space className="container classifier" direction="vertical">
      <Card title="Grouping">
        <Space wrap size="small">
          <div>
            <span>Attribute</span>{' '}
            <Select
              onChange={(e) => setActiveAttribute(e)}
              value={activeAttribute}
              size="small"
              style={{ minWidth: '15ch' }}
            >
              {Object.values(ATTRIBUTES).map((entry) => (
                <Select.Option key={entry.id} value={entry.id}>
                  {entry.name.en}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <span>Sorting</span>{' '}
            <Select onChange={(e) => setSorting(e)} value={sorting} size="small" style={{ minWidth: '15ch' }}>
              <Select.Option value="id">id</Select.Option>
              <Select.Option value="name">name</Select.Option>
            </Select>
          </div>

          <div>
            <span>Criteria</span>{' '}
            <Select
              onChange={(e) => setCriteria(e)}
              value={criteria}
              size="small"
              style={{ minWidth: '15ch' }}
            >
              <Select.Option value=">1">Very Positive</Select.Option>
              <Select.Option value=">0">Positive</Select.Option>
              <Select.Option value="5">5</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="-1">-1</Select.Option>
              <Select.Option value="-3">3</Select.Option>
              <Select.Option value="-5">-5</Select.Option>
              <Select.Option value="<0>">Negative</Select.Option>
              <Select.Option value="<1>">Very Negative</Select.Option>
            </Select>
          </div>

          <div>
            <span>Show</span>{' '}
            <Select onChange={(e) => setShow(e)} value={show} size="small" style={{ minWidth: '15ch' }}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="selected">Selected Only</Select.Option>
              <Select.Option value="non-selected">Non-Selected Only</Select.Option>
            </Select>
          </div>

          <div>
            <span>Selected</span>{' '}
            <Badge count={Object.keys(selection).length} color="cyan" overflowCount={1000} />
          </div>
        </Space>

        <Space wrap>
          {itemsList.map((item) => {
            if (show === 'selected' && !selection[item.id]) {
              return null;
            }

            if (show === 'non-selected' && selection[item.id]) {
              return null;
            }

            return (
              <div key={item.id} className="classifier__grouping-item">
                <Badge count={Number(item.id)} size="small" color="cyan" overflowCount={1000}>
                  <ItemCard
                    id={item.id}
                    width={100}
                    className={clsx(selection[item.id] && 'classifier__active-item')}
                  />
                </Badge>
                <span className="classifier__grouping-name">{item.name}</span>
              </div>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
}
