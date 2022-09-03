import { ReactNode } from 'react';
// Ant Design Resources
import { ReadOutlined } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';
import { FixedMenuButton } from 'components/buttons';

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

export function PopoverRule({ content, label, showLabel = false }: PopoverRuleProps): JSX.Element {
  return (
    <FixedMenuButton
      type="popover"
      position={0}
      icon={<ReadOutlined />}
      content={content}
      label={label || <Translate pt=" Regras" en=" Rules" />}
      showLabel={showLabel}
      buttonProps={{
        type: 'primary',
      }}
    />
  );
}
