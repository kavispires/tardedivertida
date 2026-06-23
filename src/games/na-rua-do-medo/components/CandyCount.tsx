// Ant Design Resources
import { Avatar } from 'antd';
// Icons
import { CandyIcon } from '@icons/CandyIcon';
// Components
import { Icon } from '@components/general/Icon';

type CandyCountProps = {
  candyCount: number;
  size?: 'small' | 'default' | 'large';
};

export function CandyCount({ candyCount, size = 'small' }: CandyCountProps) {
  return (
    <>
      <Icon
        icon={<CandyIcon />}
        size={size}
      />
      <Avatar
        size={size}
        style={{ backgroundColor: 'hotPink' }}
      >
        {candyCount}
      </Avatar>
    </>
  );
}
