import { Button, Card, Input, notification, Radio, Space } from 'antd';
import { DevHeader } from '../DevHeader';
import { useTitle } from 'react-use';
import { useEffect } from 'react';
import { ItemCard } from 'components/cards/ItemCard';
import { ATTRIBUTES } from './constants';
import type { Attribute, Weight, AlienItemDict } from './types';
import { useAlienItemsDocument, useItem } from './hooks';
import { Loading, LoadingPage } from 'components/loaders';
import { PageError } from 'components/errors';
import { countNonZeroAttributes, validateItem } from './helpers';
import { isEmpty } from 'lodash';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

const initialAttributeState = ATTRIBUTES.reduce((acc: any, entry) => {
  const key = entry.id as unknown as Attribute;
  acc[key] = 0;
  return acc;
}, {}) as Record<Attribute, Weight>;

function ItemClassifier() {
  useTitle('Classifier | Dev | Tarde Divertida');
  const [api, contextHolder] = notification.useNotification();
  const { isLoading, isError, data, save, setData, latestId, isSaving } = useAlienItemsDocument(api);

  if (isEmpty(data) && isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <PageError message="Something is wrong" />;
  }

  console.log(data);

  return (
    <div>
      <DevHeader title="Classifier" />
      {contextHolder}
      <ClassifyingCard latestId={latestId} data={data} save={save} setData={setData} isSaving={isSaving} />
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
  const { itemId, previousItem, nextItem, itemNumber, goTo } = useItem(latestId);

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

  const validation = validateItem(current);

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

      <Card title={`Classifying ${itemId} - ${current.name} - (${countNonZeroAttributes(current)}/25)`}>
        <Space className="classifier__grid">
          <Space className="classifier__item" direction="vertical">
            <Input placeholder="Type name" onChange={updateName} value={current.name} />
            <ItemCard id={itemId} width={100} />
          </Space>

          <Space className="classifier__attributes" wrap>
            {ATTRIBUTES.map((entry) => {
              return (
                <Space className="classifier__entry" direction="vertical">
                  <div className="title">{`${entry.name.en} - ${entry.name.pt}`}</div>
                  <Radio.Group
                    value={current.attributes[entry.id as Attribute]}
                    onChange={(e) => updateAttributeValue(entry.id, e.target.value)}
                    // size="small"
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
    <Space className="classifier__navigation">
      <Button onClick={() => goTo('first')} disabled={itemId === '1'}>
        First
      </Button>
      <Button onClick={() => goTo(-10)} disabled={itemNumber <= 10}>
        Previous 10
      </Button>
      <Button onClick={previousItem} disabled={itemId === '1'}>
        Previous
      </Button>
      <Button type="primary" onClick={() => save(data)} loading={isSaving} disabled={isSaving}>
        Save
      </Button>
      <Button onClick={nextItem} disabled={itemId === '230'}>
        Next
      </Button>
      <Button onClick={() => goTo(10)} disabled={itemNumber >= 220}>
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
