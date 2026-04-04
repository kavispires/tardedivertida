import type { ComponentProps } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Components
import { PlayerAvatar } from 'components/player/PlayerAvatar';
// Internal
import { PAIR_ICONS } from '../utils/helpers';

type LabelProps = {
  name: string;
  avatarId: string;
  index: number;
  size?: ComponentProps<typeof PlayerAvatar>['size'];
};

export function Label({ name, avatarId, index, size }: LabelProps) {
  return (
    <Flex
      align="center"
      justify="center"
      gap={3}
    >
      <PlayerAvatar
        avatarId={avatarId}
        size={size}
      />
      {PAIR_ICONS[index]}
      <Typography.Text
        className="uppercase"
        style={{ color: 'white' }}
      >
        {name}
      </Typography.Text>
    </Flex>
  );
}
