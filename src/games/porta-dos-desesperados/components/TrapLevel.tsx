// Ant Design Resources
import { Rate } from 'antd';
// Icons
import { MagicSkullIcon } from '@icons/MagicSkullIcon';
// Components
import { Icon } from '@components/general/Icon';

type TrapLevelProps = {
  level: number;
  count?: number;
};

export function TrapLevel({ level, count = 3 }: TrapLevelProps) {
  if (!level) return null;

  return (
    <Rate
      value={level}
      count={count}
      disabled
      character={({ value, index }) => (
        <Icon
          size="small"
          icon={<MagicSkullIcon />}
          className={value && index && index >= value ? 'i-trap-level-opacity' : ''}
        />
      )}
    />
  );
}
