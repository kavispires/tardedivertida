import { ReactNode } from 'react';
// Ant Design Resources
import { Avatar, AvatarProps } from 'antd';

interface IconAvatarProps extends AvatarProps {
  /**
   * The TD icon component
   */
  icon?: ReactNode;
}

/**
 * Avatar wrapper to icons
 */
export function IconAvatar({ icon, shape, ...rest }: IconAvatarProps) {
  return <Avatar src={icon} shape={shape ?? 'square'} {...rest} />;
}
