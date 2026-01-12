import type { ReactNode } from 'react';
// Ant Design Resources
import { Collapse, type CollapseProps } from 'antd';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

type CollapsibleRuleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The title of the panel (default: Rules/Regras)
   */
  title?: ReactNode;
} & Omit<CollapseProps, 'items'>;

export function CollapsibleRule({ children, title, ghost = true, ...rest }: CollapsibleRuleProps) {
  const panels: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Translate
          pt="Regras"
          en="Rules"
          custom={title}
        />
      ),
      children: children,
    },
  ];

  return (
    <Instruction contained>
      <Collapse
        ghost={ghost}
        items={panels}
        {...rest}
      />
    </Instruction>
  );
}
