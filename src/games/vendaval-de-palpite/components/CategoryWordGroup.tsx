// Ant Design Resources
import { Space } from 'antd';
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
    <Space className="full-width space-container">
      <CategoryCard categories={categories} />
      {showSecretWord && <SecretWordCard secretWord={secretWord} />}
    </Space>
  );
}
