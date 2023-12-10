import { TagsFilled } from '@ant-design/icons';
import { Tag } from 'antd';

type RelationshipCountTagProps = {
  card: string[];
};
export function RelationshipCountTag({ card }: RelationshipCountTagProps) {
  return (
    <div>
      <Tag color="blue" icon={<TagsFilled />}>
        {' '}
        {card.length}
      </Tag>
    </div>
  );
}
