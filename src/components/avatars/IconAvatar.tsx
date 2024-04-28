import { ReactNode } from 'react';
// Ant Design Resources
import { Avatar, AvatarProps } from 'antd';
import { isIOS, isSafari } from 'react-device-detect';
import { memoize } from 'lodash';

interface IconAvatarProps extends AvatarProps {
  /**
   * The TD icon component
   */
  icon?: ReactNode;
}

/**
 * Avatar wrapper to icons
 */
export function IconAvatar({ icon, shape, size, ...rest }: IconAvatarProps) {
  return (
    <Avatar src={icon} shape={shape ?? 'square'} size={size} rootClassName={getSafariClass(size)} {...rest} />
  );
}

function createDynamicClass(className: string, styles: string) {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `.${className} > svg { ${styles} }`;
  document.head.appendChild(styleElement);
}

const getSafariClass = memoize((size: AvatarProps['size']) => {
  if (!isSafari && !isIOS) return '';

  const width = typeof size === 'number' ? size : size === 'large' ? 48 : size === 'small' ? 24 : 32;

  const dynamicClass = `safari-avatar-${size ?? 'default'}`;
  const dynamicStyles = `width: ${width}px; height: ${width}px;`;
  createDynamicClass(dynamicClass, dynamicStyles);

  return dynamicClass;
});
