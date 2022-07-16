import clsx from 'clsx';
import { ReactNode } from 'react';

type RulesListProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  className?: string;
};

export function RulesList({ children, className = '' }: RulesListProps): JSX.Element {
  return <ul className={clsx('rules-list', className)}>{children}</ul>;
}
