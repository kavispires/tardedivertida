import { ReactNode } from 'react';
// Ant Design Resources
import { Card, Col, ColProps } from 'antd';

type InfoCardProps = {
  title: ReactNode;
  children: ReactNode;
} & Pick<ColProps, 'xs' | 'sm' | 'md' | 'lg'>;

export function InfoCard({ title, children, xs, sm, md, lg }: InfoCardProps) {
  return (
    <Col xs={xs ?? 24} sm={sm ?? 12} md={md ?? 8} lg={lg ?? 6}>
      <Card title={title} bordered={false} size="small" className="me__card-info">
        {children}
      </Card>
    </Col>
  );
}
