import type { ReactNode } from 'react';
// Components
import { Translate } from 'components/language/Translate';
// Sass
import styles from './SpecialRule.module.scss';

type SpecialRuleProps = {
  /**
   * The special rule content
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function SpecialRule({ children, className }: SpecialRuleProps) {
  return (
    <span className={className}>
      <span className={styles.specialRuleHighlight}>
        <Translate
          pt="Regra Especial"
          en="Special Rule"
        />
      </span>
      {children}
    </span>
  );
}
