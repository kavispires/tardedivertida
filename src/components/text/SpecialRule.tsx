import type { ReactNode } from 'react';
// Components
import { Translate } from 'components/language';
// Sass
import './SpecialRule.scss';

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
      <span className="special-rule-highlight">
        <Translate pt="Regra Especial" en="Special Rule" />
      </span>
      {children}
    </span>
  );
}
