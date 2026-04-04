// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageBlurButtonContainer } from 'components/image-cards/ImageBlurButtonContainer';
import { ImageCard } from 'components/image-cards/ImageCard';
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { GalleryEntry } from '../utils/types';

type GameOverGalleryProps = {
  gallery: GalleryEntry[];
};

export function GameOverGallery({ gallery }: GameOverGalleryProps) {
  const cardWidth = useCardWidth(6, { gap: 8, minWidth: 60, maxWidth: 200 });
  return (
    <TitledContainer
      title={
        <Translate
          pt="Histórias"
          en="Stories"
        />
      }
    >
      <Image.PreviewGroup>
        <ul className="c-gallery">
          {gallery.map((entry, index) => {
            return (
              <div
                key={`${entry.cardId}-${index}`}
                className="c-gallery__entry"
              >
                <div className="c-gallery__label">
                  <span>{entry.story}</span>
                </div>
                <ImageBlurButtonContainer cardId={entry.cardId}>
                  <ImageCard
                    cardId={entry.cardId}
                    cardWidth={cardWidth - 6} // 6 is the border total size
                  />
                </ImageBlurButtonContainer>
              </div>
            );
          })}
        </ul>
      </Image.PreviewGroup>
    </TitledContainer>
  );
}
