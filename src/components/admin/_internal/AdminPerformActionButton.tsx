import { FireFilled } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';

interface AdminPerformActionButtonProps extends ButtonProps {
  /**
   * The label of the button
   */
  label: string;
}
export const AdminPerformActionButton = ({ label, ...props }: AdminPerformActionButtonProps) => (
  <Button icon={<FireFilled />} type="primary" danger className="full-width" {...props}>
    {label}
  </Button>
);
