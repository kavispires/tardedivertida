// Design Resources
import { Avatar } from 'antd';
// Components
import { AvatarIcon } from '../../components';

type CandyCountProps = {
  candyCount: number;
  size?: 'small' | 'default' | 'large';
};

export function CandyCount({ candyCount, size = 'small' }: CandyCountProps) {
  return (
    <>
      <AvatarIcon type="candy" size={size} />
      <Avatar size={size} style={{ backgroundColor: 'hotPink' }}>
        {candyCount}
      </Avatar>
    </>
  );
}
