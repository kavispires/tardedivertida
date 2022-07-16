// Ant Design Resources
import { Avatar } from 'antd';
// Components
import { CandyIcon } from 'components/icons/CandyIcon';
import { IconAvatar } from 'components/icons/IconAvatar';

type CandyCountProps = {
  candyCount: number;
  size?: 'small' | 'default' | 'large';
};

export function CandyCount({ candyCount, size = 'small' }: CandyCountProps) {
  return (
    <>
      <IconAvatar icon={<CandyIcon />} size={size} />
      <Avatar size={size} style={{ backgroundColor: 'hotPink' }}>
        {candyCount}
      </Avatar>
    </>
  );
}
