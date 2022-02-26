import clsx from 'clsx';

interface TransparentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any;
  active?: boolean;
  activeClass?: string;
  className?: string;
}

export const TransparentButton = ({
  children,
  active = false,
  activeClass = '',
  className = '',
  ...props
}: TransparentButtonProps) => {
  return (
    <button
      className={clsx(
        'transparent-button',
        active && (activeClass || 'transparent-button--active'),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
