// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { pluralize } from '@utils/helpers';
// Components
import { TextCard } from '@components/cards/TextCard';

type CategoryCardProps = {
  categories: string[];
};

export function CategoryCard({ categories }: CategoryCardProps) {
  const { translate } = useLanguage();

  return (
    <TextCard
      header={pluralize(
        categories.length,
        translate({ pt: 'Categoria', en: 'Category' }),
        translate({ pt: 'Categorias', en: 'Categories' }),
      )}
      color="brown"
    >
      {categories.join(' + ')}
    </TextCard>
  );
}
