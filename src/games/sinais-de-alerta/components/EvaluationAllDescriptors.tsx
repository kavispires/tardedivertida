// Ant Design Resources
import { Space } from 'antd';
// Types
import { TextCard } from 'types/tdr';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';

type EvaluationAllDescriptorsProps = {
  cards: Dictionary<TextCard>;
  onSelect: (cardId: CardId) => void;
  descriptorsIds: CardId[];
  activeItem: CardId;
  matchedItems: BooleanDictionary;
};

export function EvaluationAllDescriptors({
  cards,
  onSelect,
  descriptorsIds,
  activeItem,
  matchedItems,
}: EvaluationAllDescriptorsProps) {
  return (
    <Space size="small" wrap className="space-container">
      {descriptorsIds.map((descriptorId) => (
        <TransparentButton
          key={descriptorId}
          onClick={() => onSelect(descriptorId)}
          active={activeItem === descriptorId}
          className="sda-word-button"
        >
          {matchedItems[descriptorId] && (
            <IconAvatar icon={<CheckMarkIcon />} className="sda-word-button__matched" />
          )}
          <Card hideHeader>{cards[descriptorId].text}</Card>
        </TransparentButton>
      ))}
    </Space>
  );
}
