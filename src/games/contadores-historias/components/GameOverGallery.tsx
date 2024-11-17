// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Container } from 'components/general/Container';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
// Internal
import type { GalleryEntry } from '../utils/types';
// Ant Design Resources
// Utils

type GameOverGalleryProps = {
  gallery: GalleryEntry[];
};

export function GameOverGallery({ gallery }: GameOverGalleryProps) {
  const cardWidth = useCardWidth(6, { gap: 8, minWidth: 60, maxWidth: 200 });
  return (
    <Container title={<Translate pt="Histórias" en="Stories" />}>
      <Image.PreviewGroup>
        <ul className="c-gallery">
          {gallery.map((entry, index) => {
            return (
              <div key={`${entry.cardId}-${index}`} className="c-gallery__entry">
                <div className="c-gallery__label">
                  <span>{entry.story}</span>
                </div>
                <ImageBlurButtonContainer cardId={entry.cardId}>
                  <ImageCard
                    id={entry.cardId}
                    cardWidth={cardWidth - 6} // 6 is the border total size
                  />
                </ImageBlurButtonContainer>
              </div>
            );
          })}
        </ul>
      </Image.PreviewGroup>
    </Container>
  );
}
