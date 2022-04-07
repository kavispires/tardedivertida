import clsx from 'clsx';

interface TransparentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any;
  active?: boolean;
  activeClass?: string;
  className?: string;
  hoverType?: 'scale' | 'sepia';
}

export const TransparentButton = ({
  children,
  active = false,
  activeClass = '',
  className = '',
  hoverType = 'scale',
  ...props
}: TransparentButtonProps) => {
  return (
    <button
      className={clsx(
        'transparent-button',
        `transparent-button--${hoverType}`,
        active && (activeClass || 'transparent-button--active'),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
