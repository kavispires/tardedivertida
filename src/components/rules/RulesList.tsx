import clsx from 'clsx';
import type { ReactNode } from 'react';
// Sass
import styles from './rules.module.scss';

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

/**
 * Unordered list component styled for displaying game rules
 */
export function RulesList({ children, className = '' }: RulesListProps) {
  return <ul className={clsx(styles.rulesList, className)}>{children}</ul>;
}
