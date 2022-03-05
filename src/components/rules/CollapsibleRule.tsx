// Design Resources
import { Collapse } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { Instruction } from 'components';

type CollapsibleRuleProps = {
  children: any;
  title?: string;
};
export function CollapsibleRule({ children, title }: CollapsibleRuleProps) {
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
