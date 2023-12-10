// Ant Design Resources
import { Button, Card, Image, Layout, Space } from 'antd';

import { ImageCard } from 'components/image-cards';

// Components
import './dev-image-cards.scss';
import { UseImageCardsRelationshipDataReturnValue, useRandomGroups } from './hooks';
import { useCardWidth } from 'hooks/useCardWidth';
import { RelationshipCountTag } from './RelationshipCountTag';
import { TransparentButton } from 'components/buttons';

type GroupingProps = {
  query: UseImageCardsRelationshipDataReturnValue;
};

export function Grouping({ query }: GroupingProps) {
  const cardWidth = useCardWidth(9, { containerId: 'root' });

  const { data, isDirty, setDirty, isSuccess, isSaving, save } = query;

  // Selects a random deck, but gives option select for a specific deck (1-10)
  const { cardIds, cards, onSelect, selection, relate, nextSet } = useRandomGroups(data, setDirty);

  return (
    <Layout.Content className="dev-content">
      {isSaving && <div>Saving...</div>}
      {isSuccess && !isSaving && (
        <Space className="space-container" direction="vertical">
          <Button onClick={nextSet}>New Random Cards</Button>
          <Card
            title="Choose one feature and select all cards that match"
            // extra={areRelated && <CheckCircleFilled />}
          >
            <Image.PreviewGroup>
              <div className="image-cards-group">
                {cardIds.map((cardId, index) => {
                  const isSelected = selection.includes(cardId);
                  const card = cards[index];

                  return (
                    <div className="image-card-card__image" key={cardId}>
                      <TransparentButton
                        onClick={() => onSelect(cardId)}
                        active={isSelected}
                        activeClass="image-cards-group__active"
                        hoverType="sepia"
                      >
                        <ImageCard imageId={cardId} cardWidth={cardWidth} preview={false} />
                        <Space>
                          <Button size="small">{isSelected ? 'Deselect' : 'Select'}</Button>
                          <RelationshipCountTag card={card} />
                        </Space>
                      </TransparentButton>
                    </div>
                  );
                })}
              </div>
            </Image.PreviewGroup>

            <Space className="image-card-categorizer-group-options">
              <Button onClick={nextSet} size="large" block>
                Next Set
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => save({})}
                disabled={!isDirty}
                loading={isSaving}
                danger
              >
                Save
              </Button>
              <Button onClick={relate} size="large" block type="primary" disabled={selection.length < 2}>
                Related ({selection.length})
              </Button>
            </Space>
          </Card>
        </Space>
      )}
    </Layout.Content>
  );
}
