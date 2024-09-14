// Types
import { ContenderCard } from 'types/tdr';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';

type CardProps = {
  character: ContenderCard;
  width: number;
  imageCardMode: boolean;
  className?: string;
};

export function Card({ character, width, imageCardMode, className }: CardProps) {
  if (imageCardMode) {
    return (
      <ImageBlurButtonContainer cardId={character.id}>
        <ImageCard id={character.id} cardWidth={width} className={className} preview={false} />
      </ImageBlurButtonContainer>
    );
  }

  return <CharacterCard character={character} size={width} className={className} />;
}
