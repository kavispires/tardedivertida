import clsx from 'clsx';

type RulesListProps = {
  children: any;
  className?: string;
};

export function RulesList({ children, className = '' }: RulesListProps) {
  return <ul className={clsx('rules-list', className)}>{children}</ul>;
}
