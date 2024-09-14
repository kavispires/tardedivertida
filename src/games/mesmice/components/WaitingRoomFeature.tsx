// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Icons
import { XIcon } from 'icons/XIcon';
// Components
import { IconAvatar } from 'components/avatars';
// Internal
import type { ExtendedObjectFeatureCard, ObjectCardObj } from '../utils/types';
import { ActivePlayerObjectClue } from './ActivePlayerObjectClue';
import { ObjectFeature } from './ObjectFeature';

type WaitingRoomFeatureProps = {
  activePlayer: GamePlayer;
  item: ObjectCardObj;
  clue: string;
  selectedFeatureId: string;
  features: Dictionary<ExtendedObjectFeatureCard>;
};

export function WaitingRoomFeature({
  activePlayer,
  item,
  clue,
  selectedFeatureId,
  features,
}: WaitingRoomFeatureProps) {
  return (
    <Space className="space-container">
      <ActivePlayerObjectClue activePlayer={activePlayer} item={item} clue={clue} />
      <IconAvatar icon={<XIcon />} size="large" />
      {Boolean(selectedFeatureId) && <ObjectFeature feature={features[selectedFeatureId]} width={72} />}
    </Space>
  );
}
