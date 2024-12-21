import clsx from 'clsx';
import type { ReactNode } from 'react';

type RulesListProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function RulesList({ children, className = '' }: RulesListProps) {
  return <ul className={clsx('rules-list', className)}>{children}</ul>;
}
