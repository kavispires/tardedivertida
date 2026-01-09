// Ant Design Resources
import { Button, Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackGaleriaDeSonhos = ({ track, onSubmitAnswer, user }: TrackProps) => {
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
      <RuleInstruction type="action">
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
      </RuleInstruction>

      <Card
        header={translate('Tema', 'Theme')}
        color="orange"
      >
        {track.data.theme.text}
      </Card>

      <Image.PreviewGroup>
        <SpaceContainer>
          {track.data.cards.map((cardId: ImageCardId) => {
            return (
              <SpaceContainer
                key={cardId}
                vertical
              >
                <ImageBlurButtonContainer cardId={cardId}>
                  <ImageCard
                    cardId={cardId}
                    cardWidth={cardWidth}
                  />
                </ImageBlurButtonContainer>
                <Button
                  shape="round"
                  type="primary"
                  disabled={user.ready}
                  loading={isLoading}
                  onClick={() => onSelect(cardId)}
                >
                  <Translate
                    pt="Selecionar"
                    en="Select"
                  />
                </Button>
              </SpaceContainer>
            );
          })}
        </SpaceContainer>
      </Image.PreviewGroup>
    </>
  );
};
