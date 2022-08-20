import { Card } from 'components/cards';
import { useLanguage } from 'hooks/useLanguage';
import { pluralize } from 'utils/helpers';

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
        translate('Categorias', 'Categories')
      )}
      color="brown"
    >
      {categories.join(' + ')}
    </Card>
  );
}
