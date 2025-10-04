// Ant Design Resources
import { Rate } from 'antd';
// Icons
import { MagicSkullIcon } from 'icons/collection';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';

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
        <IconAvatar
          size="small"
          icon={<MagicSkullIcon />}
          className={value && index && index >= value ? 'i-trap-level-opacity' : ''}
        />
      )}
    />
  );
}
