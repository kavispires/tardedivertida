// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { CategoryCard } from './CategoryCard';
import { SecretWordCard } from './SecretWordCard';

type CategoryWordGroupProps = {
  categories: string[];
  secretWord: string;
  showSecretWord?: boolean;
};

export function CategoryWordGroup({ categories, secretWord, showSecretWord }: CategoryWordGroupProps) {
  return (
    <SpaceContainer fullWidth>
      <CategoryCard categories={categories} />
      {showSecretWord && <SecretWordCard secretWord={secretWord} />}
    </SpaceContainer>
  );
}
