import { ItemCard } from 'components/cards/ItemCard';

type PreloadItemsProps = {
  items: string[];
};

export function PreloadItems({ items }: PreloadItemsProps) {
  return (
    <div style={{ display: 'none' }}>
      {items.map((itemId) => (
        <ItemCard key={itemId} id={itemId} className="transparent" width={1} />
      ))}
    </div>
  );
}
