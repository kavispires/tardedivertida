import clsx from 'clsx';
import { Avatar as AntAvatar, type AvatarProps as AntAvatarProps } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import avatars from 'assets/images/avatars.svg';

export interface AvatarProps extends AntAvatarProps {
  /**
   * The id of the player avatar
   */
  id?: string;
}

/**
 * Displays an Avatar svg image for given player
 * @param props
 * @returns
 */
export const Avatar = ({ id, size, shape, alt, className, ...rest }: AvatarProps) => {
  const { translate } = useLanguage();

  return (
    <AntAvatar
      className={clsx(className)}
      size={size}
      shape={shape}
      alt={alt ?? translate('Fulano', 'John Doe')}
      src={
        <svg viewBox="0 0 100 100">
          <use href={`${avatars}#avatar-${id}`}></use>
        </svg>
      }
      {...rest}
    />
  );
};
