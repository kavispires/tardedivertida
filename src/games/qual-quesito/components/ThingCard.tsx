import clsx from 'clsx';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { ItemSprite } from 'components/cards/ItemCard';
import { DualTranslate } from 'components/language/DualTranslate';

type ThingCardProps = {
  itemId: string;
  name: DualLanguageValue;
  width: number;
  maskImage?: boolean;
};

export function ThingCard({ itemId, name, width, maskImage }: ThingCardProps) {
  const colorId = Number.parseInt(itemId.replace('item-', ''), 10) % 10;
  const baseUrl = useTDBaseUrl('images');
  const backgroundUrl = `${baseUrl}/square-background.jpg`;

  return (
    <div
      className={clsx('thing-card', `thing-card--color-${colorId}`)}
      style={{ minWidth: width, maxWidth: width * 1.25, height: width * 1.25 }}
    >
      <div
        className="thing-card__background"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <ItemSprite
        itemId={itemId}
        width={width / 2}
        className={clsx('thing-card__image', { 'thing-card__image--masked': maskImage })}
      />
      <div className="thing-card__name">
        <DualTranslate>{name}</DualTranslate>
      </div>
    </div>
  );
}
