import { ReactNode } from 'react';
// Ant Design Resources
import { Collapse } from 'antd';
// Components
import { Instruction } from 'components/text';
import { Translate } from 'components/language';

type CollapsibleRuleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The title of the panel (default: Rules/Regras)
   */
  title?: ReactNode;
};
export function CollapsibleRule({ children, title }: CollapsibleRuleProps): JSX.Element {
  return (
    <Instruction contained>
      <Collapse ghost>
        <Collapse.Panel header={<Translate pt="Regras" en="Rules" custom={title} />} key="1">
          {children}
        </Collapse.Panel>
      </Collapse>
    </Instruction>
  );
}
