import { useMemo } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import { GamePlayer } from 'types/player';
// Icons
import { BoxEqualIcon } from 'icons/BoxEqualIcon';
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
// Internal
import { ExtendedObjectFeatureCard, ObjectCardObj } from '../utils/types';
import { ObjectCard } from './ObjectCard';
import { ObjectFeature } from './ObjectFeature';

type PlayerObjectClueFeatureProps = {
  user: GamePlayer;
  features: Dictionary<ExtendedObjectFeatureCard>;
};

export function PlayerObjectClueFeature({ user, features }: PlayerObjectClueFeatureProps) {
  const selectedObject = useMemo(
    () => user.items.find((item: ObjectCardObj) => item.id === user.selectedItemId),
    [user]
  );

  if (!selectedObject || !user.target) return <></>;

  return (
    <Space className="space-container">
      <ObjectCard item={selectedObject} />
      <div>
        <IconAvatar icon={<BoxPlusIcon />} size="small" />
      </div>
      <Card hideHeader>{user.clue}</Card>
      <div>
        <IconAvatar icon={<BoxEqualIcon />} size="small" />
      </div>
      <ObjectFeature feature={features[user.target]} width={72} />
    </Space>
  );
}
