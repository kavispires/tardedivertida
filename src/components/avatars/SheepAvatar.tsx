import clsx from 'clsx';
// Images
import sheep from '../../images/sheep.svg';

type SheepAvatarProps = {
  id?: string;
  animate?: boolean;
  className?: string;
  width?: number;
  [key: string]: any;
};

export const SheepAvatar = ({
  id = '25',
  animate = false,
  className = '',
  width = 100,
  ...props
}: SheepAvatarProps) => {
  const baseClass = 'sheep-avatar';
  return (
    <svg
      viewBox="0 0 100 155"
      className={clsx(baseClass, animate && `${baseClass}--bounce`, className)}
      style={{ animationDuration: `${2000 + (Math.random() + Number(id)) * 100}ms`, width: `${width}px` }}
      {...props}
    >
      <use href={sheep + `#sheep-avatar-${id}`}></use>
    </svg>
  );
};
