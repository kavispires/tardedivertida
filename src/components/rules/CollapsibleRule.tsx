// Ant Design Resources
import { Collapse } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Instruction } from 'components/text';
import { ReactNode } from 'react';

type CollapsibleRuleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The title of the panel (default: Rules/Regras)
   */
  title?: string;
};
export function CollapsibleRule({ children, title }: CollapsibleRuleProps): JSX.Element {
  const { translate } = useLanguage();

  return (
    <Instruction contained>
      <Collapse ghost>
        <Collapse.Panel header={translate('Regras', 'Rules', title)} key="1">
          {children}
        </Collapse.Panel>
      </Collapse>
    </Instruction>
  );
}
