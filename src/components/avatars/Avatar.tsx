import clsx from 'clsx';
// Ant Design Resources
import { Avatar as AntAvatar, AvatarProps } from 'antd';
// Images
import avatars from 'images/avatars.svg';
// Hooks
import { useLanguage } from 'hooks';

interface TDAvatarProps extends AvatarProps {
  id?: string;
}

/**
 * Displays an Avatar svg image for given player
 * @param props
 * @returns
 */
export const Avatar = ({ id, size, shape, alt, className, ...props }: TDAvatarProps) => {
  const { translate } = useLanguage();

  return (
    <AntAvatar
      className={clsx('avatar', className)}
      size={size}
      shape={shape}
      alt={alt ?? translate('Fulano', 'John Doe')}
      src={
        <svg viewBox="0 0 100 100">
          <use href={avatars + `#avatar-${id}`}></use>
        </svg>
      }
      {...props}
    />
  );
};
