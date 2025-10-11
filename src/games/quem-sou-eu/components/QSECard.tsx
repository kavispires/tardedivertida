// Types
import type { ContenderCard } from 'types/tdr';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';

type QSECardProps = {
  character: ContenderCard;
  width: number;
  imageCardMode: boolean;
  className?: string;
};

export function QSECard({ character, width, imageCardMode, className }: QSECardProps) {
  if (imageCardMode) {
    return (
      <ImageBlurButtonContainer cardId={character.id}>
        <ImageCard cardId={character.id} cardWidth={width} className={className} preview={false} />
      </ImageBlurButtonContainer>
    );
  }

  return <CharacterCard character={character} size={width} className={className} />;
}
