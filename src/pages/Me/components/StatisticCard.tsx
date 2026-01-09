import type { ReactNode } from 'react';
// Ant Design Resources
import { Card, Col, Statistic, type StatisticProps } from 'antd';
// Components
import { IconAvatar } from 'components/avatars';

type StatisticCardProps = {
  icon: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
} & StatisticProps;

export function StatisticCard({ icon, title, value, disabled, description, ...rest }: StatisticCardProps) {
  return (
    <Col
      xs={24}
      sm={8}
      md={8}
      lg={6}
    >
      <Card
        variant="borderless"
        size="small"
        className="me__card-statistic"
      >
        <Statistic
          title={title}
          value={disabled ? 0 : value}
          prefix={
            <IconAvatar
              size="small"
              icon={icon}
            />
          }
          {...rest}
        />
      </Card>
    </Col>
  );
}
