// Ant Design Resources
import { Button, ButtonProps } from 'antd';

import { FireFilled } from '@ant-design/icons';

interface AdminPerformActionButtonProps extends ButtonProps {
  label: string;
}
export const AdminPerformActionButton = ({ label, ...props }: AdminPerformActionButtonProps) => (
  <Button icon={<FireFilled />} type="primary" danger className="full-width" {...props}>
    {label}
  </Button>
);
