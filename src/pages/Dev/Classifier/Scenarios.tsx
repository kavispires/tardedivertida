import { Card, Descriptions, DescriptionsProps, Space, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
import { useMemo } from 'react';

import { determineAlienResponse } from './bot-utils';
import { useClassifier } from './ClassifierContext';
import { ATTRIBUTE_SIGN_DICT, SIGN_ATTRIBUTE_DICT, SIGNS, SORTED_ATTRIBUTES } from './constants';
import { Sign } from './Sign';
import { INQUIRY_SCENARIOS } from './sample-scenarios';

import type { AlienItemDict, AlienSignKnowledge, Attribute, ItemId, SignKey } from './types';
export function Scenarios() {
  const { data } = useClassifier();

  return (
    <Space className="container classifier" direction="vertical">
      <Card title="Scenarios">
        <Space wrap>
          {INQUIRY_SCENARIOS.map((scenario, index) => {
            return (
              <Scenario
                key={`inquiry-${index}`}
                id={index + 1}
                description={scenario.description}
                type="inquiry"
                inquiry={scenario.inquiry}
                attributes={scenario.attributes.length === 0 ? [] : scenario.attributes}
                knownAttributes={scenario.knownAttributes}
                expected={scenario.expected}
                data={data}
              />
            );
          })}
        </Space>
      </Card>

      <Card title="Attributes">
        <Space wrap>
          {SORTED_ATTRIBUTES.map((attribute, index) => {
            return (
              <Space size="small" align="center" direction="vertical">
                <SignCard key={attribute.id} id={ATTRIBUTE_SIGN_DICT[attribute.id]} width={50} />
                <Typography.Text>
                  {index} - {attribute.name.en}
                </Typography.Text>
              </Space>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
}

type ScenarioProps = {
  id: number;
  description: string;
  type: 'inquiry' | 'request';
  inquiry: ItemId[];
  attributes: Attribute[];
  knownAttributes: SignKey[];
  expected: Attribute;
  data: AlienItemDict;
};

function Scenario({ id, inquiry, expected, data, description, knownAttributes }: ScenarioProps) {
  const botAlienItemKnowledge = useMemo(() => {
    return inquiry.reduce((acc: AlienItemDict, itemId) => {
      acc[itemId] = data[itemId];
      return acc;
    }, {});
  }, [inquiry, data]);

  const botAlienSignKnowledge: AlienSignKnowledge = useMemo(() => {
    return knownAttributes.reduce((acc: AlienSignKnowledge, signId) => {
      acc[signId] = [];
      return acc;
    }, {});
  }, [knownAttributes]);

  const result = determineAlienResponse(inquiry, botAlienItemKnowledge, botAlienSignKnowledge, SIGNS);

  const correct = result === ATTRIBUTE_SIGN_DICT[expected];

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Case',
      children: <Typography.Text>{description}</Typography.Text>,
    },
    {
      key: '2',
      label: 'Sample',
      span: 2,
      children: (
        <Space size="small">
          {inquiry.map((itemId) => {
            return (
              <div key={itemId}>
                <ItemCard id={itemId} key={itemId} width={50} />
              </div>
            );
          })}
        </Space>
      ),
    },
    {
      key: '3',
      label: 'Expected',
      children: (
        <Space size="small">
          <Sign attribute={expected} />
        </Space>
      ),
    },
    {
      key: '4',
      label: 'Output',
      children: (
        <Space size="small">
          <Sign attribute={SIGN_ATTRIBUTE_DICT[result] as Attribute} />
        </Space>
      ),
    },
    {
      key: '5',
      label: 'Result',
      children: correct ? (
        <IconAvatar icon={<SpeechBubbleAcceptedIcon />} />
      ) : (
        <IconAvatar icon={<SpeechBubbleDeclinedIcon />} />
      ),
    },
  ];

  return <Descriptions title={`Inquiry ${id}`} items={items} size="small" column={6} layout="vertical" />;
}
