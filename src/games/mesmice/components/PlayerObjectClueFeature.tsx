import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Icons
import { BoxEqualIcon } from 'icons/BoxEqualIcon';
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { ExtendedObjectFeatureCard, ObjectCardObj } from '../utils/types';
import { ObjectCard } from './ObjectCard';
import { ObjectFeature } from './ObjectFeature';

type PlayerObjectClueFeatureProps = {
  user: GamePlayer;
  features: Dictionary<ExtendedObjectFeatureCard>;
};

export function PlayerObjectClueFeature({ user, features }: PlayerObjectClueFeatureProps) {
  const selectedObject = useMemo(
    () => user.items.find((item: ObjectCardObj) => item.id === user.selectedItemId),
    [user],
  );

  if (!selectedObject || !user.target) return null;

  return (
    <SpaceContainer>
      <ObjectCard item={selectedObject} />
      <div>
        <IconAvatar icon={<BoxPlusIcon />} size="small" />
      </div>
      <Card hideHeader>{user.clue}</Card>
      <div>
        <IconAvatar icon={<BoxEqualIcon />} size="small" />
      </div>
      <ObjectFeature feature={features[user.target]} width={72} />
    </SpaceContainer>
  );
}
