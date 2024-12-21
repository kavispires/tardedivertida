import type { ReactNode } from 'react';
// Ant Design Resources
import { ReadOutlined } from '@ant-design/icons';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';

type PopoverRuleProps = {
  /**
   * The rules themselves
   */
  content: ReactNode;
  /**
   * A custom label other than rules/regras
   */
  label?: ReactNode;
  /**
   * If label should be displayed
   */
  showLabel?: boolean;
};

export function PopoverRule({ content, label, showLabel = false }: PopoverRuleProps) {
  return (
    <FixedMenuButton
      type="popover"
      position={0}
      icon={<ReadOutlined />}
      content={content}
      label={label || <Translate pt=" Regras" en=" Rules" />}
      showLabel={showLabel}
    />
  );
}
