import { Card, Col, Statistic, StatisticProps } from 'antd';
import { IconAvatar } from 'components/avatars';
import { ReactNode } from 'react';

type StatisticCardProps = {
  icon: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
} & StatisticProps;

export function StatisticCard({ icon, title, value, disabled, description, ...rest }: StatisticCardProps) {
  return (
    <Col xs={24} sm={8} md={8} lg={6}>
      <Card bordered={false} size="small" className="me__card-statistic">
        <Statistic
          title={<>{title}</>}
          value={disabled ? 0 : value}
          prefix={<IconAvatar size="small" icon={icon} />}
          {...rest}
        />
      </Card>
    </Col>
  );
}
