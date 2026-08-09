import clsx from 'clsx';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { ClubberAvatar } from '@components/avatars/ClubberAvatar';
import { CostumeAvatar } from '@components/avatars/CostumeAvatar';
import { SuperHeroAvatar } from '@components/avatars/SuperHeroAvatar';
import { CharacterCard } from '@components/cards/CharacterCard';
import { EmojiCard } from '@components/cards/EmojiCard';
import { GlyphCard } from '@components/cards/GlyphCard';
import { ItemCard } from '@components/cards/ItemCard';
import { SuspectCard } from '@components/cards/SuspectCard';
import { TextCard } from '@components/cards/TextCard';
import { ImageBlurButtonContainer } from '@components/image-cards/ImageBlurButtonContainer';
import { ImageCard } from '@components/image-cards/ImageCard';
// Internal
import type { ItemData } from '../utils/types';

type ItemEntryProps = {
  itemEntry: ItemData;
  className?: string;
  size?: 'small';
  looseItem?: boolean;
};

export function ItemEntry({ itemEntry, className, size, looseItem }: ItemEntryProps) {
  const { translate } = useLanguage();

  const sizeMultiplier = size === 'small' ? 0.65 : 1;

  if (itemEntry.type === 'alien-item') {
    return (
      <ItemCard
        itemId={itemEntry.value.id}
        width={75 * sizeMultiplier}
        className={className}
        title={translate(itemEntry.value.name)}
      />
    );
  }

  if (itemEntry.type === 'images') {
    return (
      <ImageBlurButtonContainer cardId={itemEntry.value}>
        <ImageCard
          cardId={itemEntry.value}
          cardWidth={(looseItem ? 1.5 : 1) * 100 * sizeMultiplier}
          className={className}
          preview={false}
        />
      </ImageBlurButtonContainer>
    );
  }

  if (itemEntry.type === 'words') {
    return (
      <TextCard
        className={className}
        size={size}
      >
        {itemEntry.value.text}
      </TextCard>
    );
  }

  if (itemEntry.type === 'suspects') {
    return (
      <div className={className}>
        <SuspectCard
          suspect={itemEntry.value}
          width={100 * sizeMultiplier}
          visibleContent={false}
        />
      </div>
    );
  }

  if (itemEntry.type === 'contenders') {
    return (
      <CharacterCard
        key={itemEntry.value.id}
        character={itemEntry.value}
        size={120 * sizeMultiplier}
        className={className}
      />
    );
  }

  if (itemEntry.type === 'emojis') {
    return (
      <EmojiCard
        emojiId={String(itemEntry.value)}
        width={75 * sizeMultiplier}
        className={className}
      />
    );
  }

  if (itemEntry.type === 'glyphs') {
    return (
      <GlyphCard
        glyphId={itemEntry.value}
        width={75 * sizeMultiplier}
        className={className}
      />
    );
  }

  if (itemEntry.type === 'clubbers') {
    return (
      <ClubberAvatar
        id={itemEntry.value}
        width={75 * sizeMultiplier}
        className={clsx('avatar-entry-background', className)}
      />
    );
  }

  if (itemEntry.type === 'costumes') {
    return (
      <CostumeAvatar
        id={itemEntry.value}
        width={75 * sizeMultiplier}
        className={clsx('avatar-entry-background', className)}
      />
    );
  }

  if (itemEntry.type === 'superHeroes') {
    return (
      <SuperHeroAvatar
        id={itemEntry.value}
        width={75 * sizeMultiplier}
        className={clsx('avatar-entry-background', className)}
      />
    );
  }

  return <div className={className}>{itemEntry.type}</div>;
}
