import { Card, Divider, Select, Space, Statistic } from 'antd';

import { ATTRIBUTES } from './constants';
import { getStats } from './helpers';

import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useClassifier } from './ClassifierContext';

export function StatsCard() {
  const { data } = useClassifier();
  // Count 5s and -5s among objects
  // Counts attribute values for -5 -3 -1 0 1 3 5
  // Positive vs Negative
  const stats = useMemo(() => getStats(data), [data]);

  const [sorting, setSorting] = useState('name');

  const attributeList = useMemo(() => {
    return orderBy(
      Object.values(ATTRIBUTES),
      [
        (obj) => {
          if (sorting === 'name') return obj.name.en;
          const attributes = stats.attributeCounts[obj.id];
          if (sorting === 'positive-five') return attributes['5'];
          if (sorting === 'positive') return attributes['5'] + attributes['3'];
          if (sorting === 'neutral') return attributes['1'] + attributes['-1'];
          if (sorting === 'negative') return attributes['-5'] + attributes['-3'];
          if (sorting === 'negative-five') return attributes['-5'];
          return obj.id;
        },
      ],
      [sorting === 'name' ? 'asc' : 'desc']
    );
  }, [stats.attributeCounts, sorting]);

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

          <div>
            <span>Sorting</span>{' '}
            <Select onChange={(e) => setSorting(e)} value={sorting} size="small" style={{ minWidth: '15ch' }}>
              <Select.Option value="name">name</Select.Option>
              <Select.Option value="positive-five">Most Positive Five</Select.Option>
              <Select.Option value="positive">Most Positive</Select.Option>
              <Select.Option value="neutral">Most Neutral</Select.Option>
              <Select.Option value="negative">Most Negative</Select.Option>
              <Select.Option value="negative-five">Most Negative Five</Select.Option>
            </Select>
          </div>
        </Space>
        <Divider />

        <Space wrap size="small">
          {attributeList.map((entry) => {
            const attribute = stats.attributeCounts[entry.id];
            return (
              <Card title={`${entry.name.en} - ${entry.name.pt}`} key={entry.id}>
                <Statistic
                  title="Positive Five"
                  value={(attribute['5'] * 100) / stats.total}
                  suffix="%"
                  precision={1}
                />
                <Statistic
                  title="Positive"
                  value={((attribute['5'] + attribute['3']) * 100) / stats.total}
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
                  title="Negative"
                  value={((attribute['-5'] + attribute['-3']) * 100) / stats.total}
                  suffix="%"
                  precision={1}
                />
                <Statistic
                  title="Negative Five"
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
