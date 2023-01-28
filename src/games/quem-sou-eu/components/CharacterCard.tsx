import clsx from 'clsx';
// Ant Design resources
import { Image } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useBlurCards } from 'hooks/useBlurCards';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { DualTranslate } from 'components/language';
import { ImageBlurButton } from 'components/cards';

type CharacterCardProps = {
  size: number;
  character: any;
  className?: string;
};

export function CharacterCard({ size, character, className }: CharacterCardProps) {
  const { dualTranslate } = useLanguage();
  const { shouldBeBlurred } = useBlurCards();

  const isBlurred = shouldBeBlurred(character.id);

  const imageURL = character.id.replace(/-/g, '/');

  return (
    <>
      <div className={clsx('q-character', className)} style={{ width: `${size}px` }}>
        <span className="q-character-name">
          <DualTranslate>{character.name}</DualTranslate>
        </span>
        <Image
          src={`${process.env.REACT_APP_TDI_IMAGES_URL}${imageURL}.jpg`}
          width={size}
          className={clsx('q-character-image', isBlurred && 'q-character-image--blur')}
          fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
          alt={dualTranslate(character.name)}
          preview={false}
          title={dualTranslate(character.name)}
        />
      </div>
      <ImageBlurButton cardId={character.id} />
    </>
  );
}
