import { TagsFilled } from '@ant-design/icons';
import { Tag } from 'antd';

type RelationshipCountTagProps = {
  card: string[];
};
export function RelationshipCountTag({ card }: RelationshipCountTagProps) {
  return (
    <div>
      <Tag color={card.length > 0 ? 'blue' : undefined} icon={<TagsFilled />}>
        {' '}
        {card.length}
      </Tag>
    </div>
  );
}
