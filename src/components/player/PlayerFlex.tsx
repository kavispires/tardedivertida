// Ant Design Resources
import { Flex, type FlexProps } from 'antd';
// Utils
import { AVATARS } from '@utils/avatars';

export type PlayerFlexProps = FlexProps & {
  /**
   * The id of the avatar that will color the flex background/border
   */
  avatarId: string;
  /**
   * The id of the avatar that will color the flex background/border
   */
  withBorder?: boolean;
};

/**
 * Ant Design Flex component with player-specific color styling based on avatar
 */
export const PlayerFlex = ({ avatarId, withBorder, ...rest }: PlayerFlexProps) => {
  const avatar = AVATARS[avatarId];

  return (
    <Flex
      {...rest}
      style={{
        ...rest.style,
        backgroundColor: rest.style?.backgroundColor || avatar?.color,
        border: rest.style?.border || (withBorder ? `3px solid ${avatar?.color}` : 'none'),
      }}
    />
  );
};
