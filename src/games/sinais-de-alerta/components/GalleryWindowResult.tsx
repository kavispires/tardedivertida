// Ant Design Resources
import { Divider, Typography } from 'antd';
import { CrownFilled } from '@ant-design/icons';
// Types
import type { GalleryEntry } from '../utils/types';
// Utils
// Components
import { Translate } from 'components/language';
import { GarbageIcon } from 'icons/GarbageIcon';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TextCard } from 'types/tdr';
import { getTitle } from '../utils/helpers';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type GalleryWindowResultProps = {
  cards: Dictionary<TextCard>;

  galleryEntry: GalleryEntry;
  gameLanguage: Language;
};

export function GalleryWindowResult({
  cards,

  galleryEntry,
  gameLanguage,
}: GalleryWindowResultProps) {
  return (
    <div className="sda-gallery__result">
      <Divider className="m-0" />
      {galleryEntry.correctness !== 2 && (
        <>
          <div className="sda-gallery__label">
            <Translate pt="E o título correto da placa é" en="And the warning sign title is" />
          </div>
          <div className="sda-gallery__speech-bubble mb-4">
            <CrownFilled className="sda-gallery__speech-bubble-icon" />
            {getTitle(cards, galleryEntry.subjectId, galleryEntry.descriptorId, gameLanguage)}
          </div>

          <Typography.Paragraph className="color-red">
            <IconAvatar icon={<GarbageIcon />} size="small" shape="square" />
            <Translate
              pt="Nossa, ninguém acertou. Esse desenho deve ter sido muito ruim."
              en="Wow, nobody got it. It must have been a very crappy drawing. Shame..."
            />
          </Typography.Paragraph>
        </>
      )}

      <Typography.Paragraph>
        <Translate pt="O criador ganhou" en="The creator earned" />:{' '}
        <PointsHighlight>{galleryEntry.artistScore}</PointsHighlight> pontos
      </Typography.Paragraph>
    </div>
  );
}