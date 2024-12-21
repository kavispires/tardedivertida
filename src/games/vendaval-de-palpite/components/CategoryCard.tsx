// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { Card } from 'components/cards';

type CategoryCardProps = {
  categories: string[];
};

export function CategoryCard({ categories }: CategoryCardProps) {
  const { translate } = useLanguage();

  return (
    <Card
      header={pluralize(
        categories.length,
        translate('Categoria', 'Category'),
        translate('Categorias', 'Categories'),
      )}
      color="brown"
    >
      {categories.join(' + ')}
    </Card>
  );
}
