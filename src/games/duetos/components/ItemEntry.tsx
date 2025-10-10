import clsx from 'clsx';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { ClubberAvatar } from 'components/avatars/ClubberAvatar';
import { CostumeAvatar } from 'components/avatars/CostumeAvatar';
import { SuperHeroAvatar } from 'components/avatars/SuperHeroAvatar';
import { Card } from 'components/cards';
import { CharacterCard } from 'components/cards/CharacterCard';
import { EmojiCard } from 'components/cards/EmojiCard';
import { GlyphCard } from 'components/cards/GlyphCard';
import { ItemCard } from 'components/cards/ItemCard';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
// Internal
import type { Item } from '../utils/types';

type ItemEntryProps = {
  itemEntry: Item;
  className?: string;
  size?: 'small';
  looseItem?: boolean;
};

export function ItemEntry({ itemEntry, className, size, looseItem }: ItemEntryProps) {
  const { dualTranslate } = useLanguage();

  const sizeMultiplier = size === 'small' ? 0.75 : 1;

  if (itemEntry.type === 'alien-item') {
    return (
      <ItemCard
        id={itemEntry.value.id}
        width={75 * sizeMultiplier}
        className={className}
        title={dualTranslate(itemEntry.value.name)}
      />
    );
  }

  if (itemEntry.type === 'images') {
    return (
      <ImageBlurButtonContainer cardId={itemEntry.value}>
        <ImageCard
          id={itemEntry.value}
          cardWidth={(looseItem ? 1.5 : 1) * 100 * sizeMultiplier}
          className={className}
          preview={false}
        />
      </ImageBlurButtonContainer>
    );
  }

  if (itemEntry.type === 'words') {
    return (
      <Card hideHeader className={className} size={size}>
        {itemEntry.value.text}
      </Card>
    );
  }

  if (itemEntry.type === 'suspects') {
    return (
      <div className={className}>
        <SuspectCard suspect={itemEntry.value} width={100 * sizeMultiplier} hideName />
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
    return <EmojiCard emojiId={String(itemEntry.value)} width={75 * sizeMultiplier} className={className} />;
  }

  if (itemEntry.type === 'glyphs') {
    return <GlyphCard id={itemEntry.value} width={75 * sizeMultiplier} className={className} />;
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
