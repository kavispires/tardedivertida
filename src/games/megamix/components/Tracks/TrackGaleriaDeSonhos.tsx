// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Types
import type { TrackProps } from '../../utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { Card } from 'components/cards';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';

export const TrackGaleriaDeSonhos = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const cardWidth = useCardWidth(8, { gap: 8, minWidth: 150, maxWidth: 350, margin: 8 });
  const { isLoading } = useLoading();
  const { translate } = useLanguage();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.cards));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Galeria dos Sonhos', en: 'Dream Gallery' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Com o tema abaixo, qual <CardHighlight>carta-sonho</CardHighlight> é a mais provável dos outros
              jogadores também visitarem?
            </>
          }
          en={
            <>
              With the theme below, which <CardHighlight>Dream Card</CardHighlight> best relates to it?
            </>
          }
        />
      </Instruction>

      <Card header={translate('Tema', 'Theme')} color="orange">
        {track.data.theme.text}
      </Card>

      <Image.PreviewGroup>
        <Space className="space-container">
          {track.data.cards.map((cardId: ImageCardId) => {
            return (
              <Space className="space-container" direction="vertical">
                <ImageBlurButtonContainer cardId={cardId}>
                  <ImageCard imageId={cardId} cardWidth={cardWidth} />
                </ImageBlurButtonContainer>
                <Button
                  shape="round"
                  type="primary"
                  disabled={user.ready}
                  loading={isLoading}
                  onClick={() => onSelect(cardId)}
                >
                  <Translate pt="Selecionar" en="Select" />
                </Button>
              </Space>
            );
          })}
        </Space>
      </Image.PreviewGroup>
    </>
  );
};
