import { useTitle } from 'react-use';
// Ant Design Resources
import { Button, Card, Image, Layout, Space } from 'antd';
import { DevHeader } from '../DevHeader';
import { ImageCard } from 'components/image-cards';

import { CheckCircleFilled } from '@ant-design/icons';
// Components
import './dev-image-cards.scss';
import { useImageCardsRelationshipData, useRandomCards } from './hooks';
import { useCardWidth } from 'hooks/useCardWidth';

function ImageCardsRelationshipsPage() {
  useTitle('Image Cards Relationships | Dev | Tarde Divertida');

  const cardWidth = useCardWidth(4, { containerId: 'root' });

  const { data, isLoading, isDirty, setDirty, isSuccess, isSaving, save } = useImageCardsRelationshipData();

  // Selects a random deck, but gives option select for a specific deck (1-10)
  const { cardAId, cardBId, relate, unrelate, areRelated } = useRandomCards(data, setDirty);

  return (
    <Layout className="dev-layout">
      <DevHeader title="Image Cards Categorizer" />
      <Layout.Content className="dev-content">
        {isLoading && <div>Loading...</div>}
        {isSaving && <div>Saving...</div>}
        {isSuccess && !isSaving && (
          <Space className="space-container" direction="vertical">
            <Card title={`${cardAId} X ${cardBId}`} extra={areRelated && <CheckCircleFilled />}>
              <div className="image-card-card">
                <Image.PreviewGroup>
                  <div className="image-card-card__image">
                    <ImageCard imageId={cardAId} cardWidth={cardWidth} />
                  </div>
                  <div className="image-card-card__image">
                    <ImageCard imageId={cardBId} cardWidth={cardWidth} />
                  </div>
                </Image.PreviewGroup>
              </div>

              <Space className="image-card-categorizer-options">
                <Button onClick={unrelate} size="large" block>
                  Unrelate
                </Button>
                <Button onClick={relate} size="large" block type="primary">
                  Relate
                </Button>
              </Space>
            </Card>

            <Button type="primary" onClick={() => save({})} disabled={!isDirty} loading={isSaving}>
              Save
            </Button>
          </Space>
        )}
      </Layout.Content>
    </Layout>
  );
}

export default ImageCardsRelationshipsPage;
