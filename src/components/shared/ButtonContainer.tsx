import clsx from 'clsx';
// Design Resources
import { Space } from 'antd';

type ButtonContainerProps = {
  children: any;
  wrap?: boolean;
  className?: string;
};

export function ButtonContainer({
  children,
  wrap = false,
  className = '',
}: ButtonContainerProps): JSX.Element {
  const baseClass = 'button-container';
  return (
    <Space className={clsx(baseClass, className)} wrap={wrap} data-testid="button-container">
      {children}
    </Space>
  );
}
