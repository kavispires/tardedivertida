import { BugFilled } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { DebugOnly } from './DebugOnly';

/**
 * Button only available during dev only
 * @returns
 */
export function DevButton({ children, type, ...rest }: ButtonProps) {
  return (
    <DebugOnly devOnly>
      <Button icon={<BugFilled />} type={type ?? 'primary'} {...rest}>
        {children}
      </Button>
    </DebugOnly>
  );
}
