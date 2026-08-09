import type { ReactNode } from 'react';
// Ant Design Resources
import { Collapse, type CollapseProps } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { RuleInstruction, type RuleInstructionProps } from '@components/text/RuleInstruction';

type CollapsibleRuleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The title of the panel (default: Rules/Regras)
   */
  title?: ReactNode;
  /**
   * Whether the collapse panel should have a ghost style (default: true)
   */
  ruleInstructionProps?: Omit<RuleInstructionProps, 'children' | 'type'> & {
    type?: RuleInstructionProps['type'] | 'rule';
  };
} & Omit<CollapseProps, 'items'>;

/**
 * Collapsible panel component for displaying game rules with expand/collapse functionality
 */
export function CollapsibleRule({
  children,
  title,
  ghost = true,
  ruleInstructionProps = {},
  ...rest
}: CollapsibleRuleProps) {
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
      style={{ padding: 0, ...ruleInstructionProps.style }}
      {...ruleInstructionProps}
      type={ruleInstructionProps.type ?? 'rule'}
    >
      <Collapse
        ghost={ghost}
        items={panels}
        {...rest}
      />
    </RuleInstruction>
  );
}
