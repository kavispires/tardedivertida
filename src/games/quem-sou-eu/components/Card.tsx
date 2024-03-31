// Types
import { ContenderCard } from 'types/tdr';
import { CharacterCard } from 'components/cards/CharacterCard';
// Components
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
        <ImageCard id={character.id} cardWidth={width} className={className} />
      </ImageBlurButtonContainer>
    );
  }

  return <CharacterCard character={character} size={width} className={className} />;
}
