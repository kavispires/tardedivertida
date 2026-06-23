import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/game';
// Icons
import { BoxEqualIcon } from '@icons/BoxEqualIcon';
import { BoxPlusIcon } from '@icons/BoxPlusIcon';
// Components
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { SpaceContainer } from '@components/layout/SpaceContainer';
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
        <Icon
          icon={<BoxPlusIcon />}
          size="small"
        />
      </div>
      <Card hideHeader>{user.clue}</Card>
      <div>
        <Icon
          icon={<BoxEqualIcon />}
          size="small"
        />
      </div>
      <ObjectFeature
        feature={features[user.target]}
        width={72}
      />
    </SpaceContainer>
  );
}
