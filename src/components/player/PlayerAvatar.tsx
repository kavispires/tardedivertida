import clsx from 'clsx';
// Ant Design Resources
import { Avatar, type AvatarProps } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Images
import avatars from 'assets/images/avatars.svg?url';

export interface PlayerAvatarProps extends AvatarProps {
  /**
   * The id of the player avatar
   */
  avatarId: string;
}

/**
 * Displays an Avatar svg image for given player
 * @param props.avatarId The id of the player avatar
 * @param props.size The size of the avatar (default: 'default')
 * @param props.shape The shape of the avatar (default: 'square')
 * @param props.alt The alt text for the avatar (default: 'Fulano' or 'John Doe' depending on language)
 * @param props.className Optional custom class name
 * @param rest All other Avatar props
 * @returns
 */
export const PlayerAvatar = ({ avatarId, size, shape, alt, className, ...rest }: PlayerAvatarProps) => {
  const { translate } = useLanguage();

  return (
    <Avatar
      className={clsx(className)}
      size={size}
      shape={shape}
      alt={alt ?? translate('Fulano', 'John Doe')}
      src={
        <svg viewBox="0 0 100 100">
          <use href={`${avatars}#avatar-${avatarId}`}></use>
        </svg>
      }
      {...rest}
    />
  );
};
