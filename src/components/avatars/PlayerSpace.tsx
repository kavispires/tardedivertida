// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Utils
import { AVATARS } from 'utils/avatars';

export type PlayerSpaceProps = SpaceProps & {
  /**
   * The id of the avatar that will color the space background/border
   */
  avatarId: string;
  /**
   * The id of the avatar that will color the space background/border
   */
  withBorder?: boolean;
};

export const PlayerSpace = ({ avatarId, withBorder, ...rest }: PlayerSpaceProps) => {
  const avatar = AVATARS[avatarId];

  return (
    <Space
      {...rest}
      style={{
        ...rest.style,
        backgroundColor: rest.style?.backgroundColor || avatar?.color,
        border: rest.style?.border || (withBorder ? `3px solid ${avatar?.color}` : 'none'),
      }}
    />
  );
};
