import clsx from 'clsx';
// The button reset class is in index.scss because it needs to be applied first so any custom classname can override it
// import './DivButton.scss';

type DivButtonProps = {
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button meant to look like a simple div, but with click functionality.
 */
export function DivButton({ className, ...props }: DivButtonProps) {
  return <button className={clsx('button-reset', className)} {...props} />;
}
