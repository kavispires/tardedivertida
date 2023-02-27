import {
  AutoComplete,
  Button,
  Card,
  Divider,
  Input,
  notification,
  Radio,
  Space,
  Statistic,
  Switch,
} from 'antd';
import { DevHeader } from '../DevHeader';
import { useTitle } from 'react-use';
import { useEffect, useState } from 'react';
import { ItemCard } from 'components/cards/ItemCard';
import { ATTRIBUTES, FIRST_ID, LAST_ID } from './constants';
import type { Attribute, Weight, AlienItemDict, ItemId } from './types';
import { useAlienItemsDocument, useItem } from './hooks';
import { Loading, LoadingPage } from 'components/loaders';
import { PageError } from 'components/errors';
import { countNonZeroAttributes, getStats, validateItem } from './helpers';
import { isEmpty } from 'lodash';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

const initialAttributeState = Object.keys(ATTRIBUTES).reduce((acc: any, key) => {
  acc[key] = 0;
  return acc;
}, {}) as Record<Attribute, Weight>;

function ItemClassifier() {
  useTitle('Classifier | Dev | Tarde Divertida');
  const [api, contextHolder] = notification.useNotification();
  const { isLoading, isError, data, save, setData, latestId, isSaving } = useAlienItemsDocument(api);
  const [view, setView] = useState('default');

  if (isEmpty(data) && isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <PageError message="Something is wrong" />;
  }

  console.log(data);

  return (
    <div>
      <DevHeader
        title="Classifier"
        extra={
          <Switch
            checkedChildren="Stats On"
            unCheckedChildren="Stats Off"
            defaultChecked={view === 'stats'}
            onChange={(e) => setView(e ? 'stats' : 'default')}
          />
        }
      />
      {contextHolder}
      {view === 'default' && (
        <ClassifyingCard latestId={latestId} data={data} save={save} setData={setData} isSaving={isSaving} />
      )}
      {view === 'stats' && <StatsCard data={data} />}
    </div>
  );
}

export default ItemClassifier;

type ClassifyingCardProps = {
  latestId: string;
  data: AlienItemDict;
  save: (newData: AlienItemDict) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<AlienItemDict>>;
  isSaving: boolean;
};

function ClassifyingCard({ latestId, data, save, setData, isSaving }: ClassifyingCardProps) {
  const { itemId, previousItem, nextItem, itemNumber, goTo, setItemId } = useItem(latestId);

  const current = data[itemId];

  useEffect(() => {
    if (!current) {
      setData((prevData) => ({
        ...prevData,
        [itemId]: {
          id: itemId,
          name: '',
          attributes: initialAttributeState,
        },
      }));
    }
  }, [current]); // eslint-disable-line

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        name: e.target.value.toLowerCase(),
      },
    }));
  };

  const updateAttributeValue = (attributeId: string, value: number) => {
    setData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        attributes: {
          ...prevData[itemId].attributes,
          [attributeId]: value,
        },
      },
    }));
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
        latestId={latestId}
        data={data}
      />

      <Card
        title={`Classifying ${itemId} - ${current.name} - (${countNonZeroAttributes(current)}/25)`}
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
        latestId={latestId}
        data={data}
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
  save: (newData: AlienItemDict) => Promise<void>;
  latestId: string;
  data: AlienItemDict;
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
      <Button type="primary" onClick={() => save(data)} loading={isSaving} disabled={isSaving}>
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
  console.log(stats.attributeCounts);
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
