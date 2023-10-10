import { Card, Divider, Space, Statistic } from 'antd';

import { ATTRIBUTES } from './constants';
import { getStats } from './helpers';

import type { AlienItemDict } from './types';

type StatsCardProps = {
  data: AlienItemDict;
};

export function StatsCard({ data }: StatsCardProps) {
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
