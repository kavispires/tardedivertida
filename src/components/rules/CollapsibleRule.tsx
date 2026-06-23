import type { ReactNode } from 'react';
// Ant Design Resources
import { Collapse, type CollapseProps } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';

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

/**
 * Collapsible panel component for displaying game rules with expand/collapse functionality
 */
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
    <RuleInstruction
      type="tip"
      style={{ padding: 0 }}
    >
      <Collapse
        ghost={ghost}
        items={panels}
        {...rest}
      />
    </RuleInstruction>
  );
}
