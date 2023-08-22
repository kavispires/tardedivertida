import {
  AutoComplete,
  Badge,
  Button,
  Card,
  Divider,
  Input,
  notification,
  Radio,
  Segmented,
  Select,
  Space,
  Statistic,
} from 'antd';
import { DevHeader } from '../DevHeader';
import { useTitle } from 'react-use';
import { useEffect, useMemo, useState } from 'react';
import { ItemCard } from 'components/cards/ItemCard';
import { ATTRIBUTES, FIRST_ID, LAST_ID } from './constants';
import type { Attribute, Weight, AlienItemDict, ItemId, AlienItem } from './types';
import { UseAlienItemDocumentReturnValue, useAlienItemsDocument, useItem } from './hooks';
import { Loading, LoadingPage } from 'components/loaders';
import { PageError } from 'components/errors';
import { countNonZeroAttributes, getStats, initialAttributeState, validateItem } from './helpers';
import { get, isEmpty, orderBy } from 'lodash';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';

function ItemClassifier() {
  useTitle('Classifier | Dev | Tarde Divertida');
  const [api, contextHolder] = notification.useNotification();

  const { isLoading, isError, data, save, isSaving, itemUtils, isDirty } = useAlienItemsDocument(api);
  const [view, setView] = useState('default');

  if (isEmpty(data) && isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <PageError message="Something is wrong" />;
  }

  const segments = [
    { label: 'Classifier', value: 'default', disabled: view === 'default' },
    { label: 'Grouping', value: 'grouping', disabled: view === 'grouping' },
    { label: 'Stats', value: 'stats', disabled: view === 'stats' },
  ];

  return (
    <div>
      <DevHeader
        title="Classifier"
        extra={<Segmented options={segments} defaultValue={view} onChange={(v: any) => setView(v)} />}
      />
      {contextHolder}
      {view === 'default' && (
        <ClassifyingCard
          itemUtils={itemUtils}
          data={data}
          save={save}
          isSaving={isSaving}
          isDirty={isDirty}
        />
      )}
      {view === 'grouping' && <Grouping data={data} />}
      {view === 'stats' && <StatsCard data={data} />}
    </div>
  );
}

export default ItemClassifier;

type ClassifyingCardProps = Pick<
  UseAlienItemDocumentReturnValue,
  'itemUtils' | 'isSaving' | 'data' | 'save' | 'isDirty'
>;

function ClassifyingCard({ data, itemUtils, save, isDirty, isSaving }: ClassifyingCardProps) {
  const { itemId, previousItem, nextItem, itemNumber, goTo, setItemId } = useItem(itemUtils.latestId);

  const current = data[itemId];

  useEffect(() => {
    if (!current) {
      itemUtils.create(itemId);
    }
  }, [current]); // eslint-disable-line

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemUtils.updateName(itemId, e.target.value.toLowerCase());
  };

  const updateAttributeValue = (attributeId: string, value: number) => {
    itemUtils.updateAttributeValue(itemId, attributeId, value as Weight);
  };

  if (!current) {
    return (
      <Space className="space-container">
        <Loading />
      </Space>
    );
  }

  const validation = validateItem(current, initialAttributeState);

  return (
    <Space className="container classifier" direction="vertical">
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

      <Card
        title={`Classifying ${itemId} - ${current.name} - (${countNonZeroAttributes(current)}/30)`}
        extra={<Search setItemId={setItemId} data={data} />}
      >
        <Space className="classifier__grid">
          <Space className="classifier__item" direction="vertical">
            <Input placeholder="Type name" onChange={updateName} value={current.name} />
            <ItemCard id={itemId} width={100} />
          </Space>

          <Space className="classifier__attributes" wrap>
            {Object.values(ATTRIBUTES).map((entry) => {
              return (
                <Space className="classifier__entry" direction="vertical" key={entry.id}>
                  <div className="title">{`${entry.name.en} - ${entry.name.pt}`}</div>
                  <Radio.Group
                    value={current.attributes[entry.id as Attribute]}
                    onChange={(e) => updateAttributeValue(entry.id, e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio.Button type="primary" value={-5}>
                      -5
                    </Radio.Button>
                    <Radio.Button value={-3}>-3</Radio.Button>
                    <Radio.Button value={-1}>-1</Radio.Button>
                    <Radio.Button
                      value={0}
                      style={{
                        backgroundColor: current.attributes[entry.id as Attribute] === 0 ? 'red' : 'white',
                      }}
                    >
                      0
                    </Radio.Button>
                    <Radio.Button value={1}>1</Radio.Button>
                    <Radio.Button value={3}>3</Radio.Button>
                    <Radio.Button value={5}>5</Radio.Button>
                  </Radio.Group>
                </Space>
              );
            })}
          </Space>

          <Space className="classifier__item" direction="vertical">
            <Input placeholder="Type name" onChange={updateName} value={current.name} />
            <ItemCard id={itemId} width={100} />
          </Space>
        </Space>
        <Space className="classifier__verifiers">
          <Verifier label="Has name" value={validation.hasName} />
          <Verifier label="Has no zeroes" value={validation.hasNoZeroes} />
          <Verifier label="Has positive values" value={validation.hasPositive} />
          <Verifier label="Has at least one 5" value={validation.hasFive} />
        </Space>
      </Card>

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
    </Space>
  );
}

type ControlsProps = {
  itemId: string;
  itemNumber: number;
  previousItem: () => void;
  nextItem: () => void;
  goTo: (target: number | 'first' | 'last') => void;
  isSaving: boolean;
  save: UseAlienItemDocumentReturnValue['save'];
  latestId: string;
  data: AlienItemDict;
  isDirty: boolean;
};
function Controls({
  itemId,
  itemNumber,
  previousItem,
  nextItem,
  goTo,
  save,
  isSaving,
  data,
  latestId,
  isDirty,
}: ControlsProps) {
  return (
    <Space className="classifier__navigation" wrap>
      <Button onClick={() => goTo('first')} disabled={itemId === FIRST_ID}>
        First
      </Button>
      <Button onClick={() => goTo(-10)} disabled={itemNumber <= 10}>
        Previous 10
      </Button>
      <Button onClick={previousItem} disabled={itemId === FIRST_ID}>
        Previous
      </Button>
      <Button type="primary" onClick={() => save(data)} loading={isSaving} disabled={isSaving || !isDirty}>
        Save
      </Button>
      <Button onClick={nextItem} disabled={itemId === LAST_ID}>
        Next
      </Button>
      <Button onClick={() => goTo(10)} disabled={itemNumber >= Number(LAST_ID) - 10}>
        Next 10
      </Button>
      <Button onClick={() => goTo('last')} disabled={itemNumber >= Number(latestId) - 1}>
        Latest
      </Button>
    </Space>
  );
}

type VerifierProps = {
  label: string;
  value: boolean;
};
function Verifier({ label, value }: VerifierProps) {
  return (
    <div className="classifier__verifier">
      {label}:{' '}
      {value ? (
        <CheckCircleFilled style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      )}
    </div>
  );
}

type SearchProps = {
  data: AlienItemDict;
  setItemId: React.Dispatch<React.SetStateAction<string>>;
};
function Search({ data, setItemId }: SearchProps) {
  const namesDict = Object.values(data).reduce((acc: Record<string, ItemId>, entry) => {
    acc[entry.name] = entry.id;
    return acc;
  }, {});
  const names = Object.keys(namesDict).map((name) => ({ value: name }));

  const onSelect = (name: string) => {
    if (namesDict[name]) {
      setItemId(namesDict[name]);
    }
  };

  const onSearch = (e: any) => console.log({ search: e });

  return (
    <Space>
      <AutoComplete
        options={names}
        style={{ width: 150 }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="Go to..."
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Space>
  );
}

type StatsCardProps = {
  data: AlienItemDict;
};
function StatsCard({ data }: StatsCardProps) {
  // Count 5s and -5s among objects
  // Counts attribute values for -5 -3 -1 0 1 3 5
  // Positive vs Negative
  const stats = getStats(data);
  return (
    <Space className="container classifier" direction="vertical">
      <Card title={`Stats`}>
        <Space wrap size="large">
          <Statistic title="Positive Fives" value={stats.positiveFives} suffix="%" />
          <Statistic title="Negative Fives" value={stats.negativeFives} suffix="%" />
          <Statistic
            title="Positive Attributes Total Average"
            value={stats.positiveAttributesMean}
            precision={1}
          />
          <Statistic
            title="Negative Attributes Total Average"
            value={stats.negativeAttributesMean}
            precision={1}
          />
        </Space>
        <Divider />

        <Space wrap size="small">
          {Object.values(ATTRIBUTES).map((entry) => {
            const attribute = stats.attributeCounts[entry.id];
            return (
              <Card title={`${entry.name.en} - ${entry.name.pt}`} key={entry.id}>
                <Statistic
                  title="Positive"
                  value={((attribute['5'] + attribute['3']) * 100) / stats.total}
                  suffix="%"
                  precision={1}
                />
                <Statistic
                  title="Negative"
                  value={((attribute['-5'] + attribute['-3']) * 100) / stats.total}
                  suffix="%"
                  precision={1}
                />
                <Statistic
                  title="Neutral"
                  value={((attribute['-1'] + attribute['1']) * 100) / stats.total}
                  suffix="%"
                  precision={1}
                  className="stat"
                />
                <Statistic
                  title={'Five'}
                  value={(attribute['5'] * 100) / stats.total}
                  suffix="%"
                  precision={1}
                />
                <Statistic
                  title={'Negative Five'}
                  value={(attribute['-5'] * 100) / stats.total}
                  suffix="%"
                  precision={1}
                  className="stat"
                />
              </Card>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
}

function checkCriteria(item: AlienItem, attribute: Attribute, criteria: string) {
  if (criteria === '>0') {
    return item.attributes[attribute] > 0;
  }
  if (criteria === '>1') {
    return item.attributes[attribute] > 1;
  }

  if (criteria === '<0') {
    return item.attributes[attribute] < 0;
  }
  if (criteria === '<1') {
    return item.attributes[attribute] < 1;
  }

  if (criteria === '5') {
    return item.attributes[attribute] === 5;
  }

  if (criteria === '3') {
    return item.attributes[attribute] === 3;
  }

  if (criteria === '1') {
    return item.attributes[attribute] === 1;
  }

  if (criteria === '-1') {
    return item.attributes[attribute] === -1;
  }

  if (criteria === '-3') {
    return item.attributes[attribute] === -3;
  }

  if (criteria === '-5') {
    return item.attributes[attribute] === -5;
  }

  return true;
}

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

  console.log(selection);

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
