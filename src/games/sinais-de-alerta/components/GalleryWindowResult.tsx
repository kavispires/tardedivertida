// Ant Design Resources
import { Typography } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { SlideShowBubbleValue, SlideShowLabel, SlideShowNoWins } from 'components/slide-show';
// Internal
import type { GalleryEntry } from '../utils/types';
import { getTitle } from '../utils/helpers';

type GalleryWindowResultProps = {
  cards: Dictionary<TextCard>;
  galleryEntry: GalleryEntry;
  gameLanguage: Language;
};

export function GalleryWindowResult({ cards, galleryEntry, gameLanguage }: GalleryWindowResultProps) {
  return (
    <div className="sda-gallery__result">
      {galleryEntry.correctness !== 2 && (
        <>
          <SlideShowLabel>
            <Translate pt="E o título correto da placa é" en="And the warning sign title is" />
          </SlideShowLabel>

          <SlideShowBubbleValue winner>
            {getTitle(cards, galleryEntry.subjectId, galleryEntry.descriptorId, gameLanguage)}
          </SlideShowBubbleValue>

          {galleryEntry.artistScore === 0 && (
            <SlideShowNoWins>
              <Translate
                pt="Esse desenho deve ter sido muito ruim."
                en="It must have been a very crappy drawing. Shame..."
              />
            </SlideShowNoWins>
          )}
        </>
      )}

      <Typography.Paragraph className="mt-2">
        <Translate pt="O criador ganhou" en="The creator earned" />:{' '}
        <PointsHighlight>{galleryEntry.artistScore}</PointsHighlight> pontos
      </Typography.Paragraph>
    </div>
  );
}
