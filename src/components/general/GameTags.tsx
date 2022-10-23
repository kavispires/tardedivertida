// Ant Design Resources
import { Space, SpaceProps, Tag } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { TAG_DICT } from 'utils/constants';

const sortTags = (tags: string[]) => {
  const sortedTags: string[] = [];

  tags.forEach((tag) => {
    if (TAG_DICT?.[tag]?.index !== undefined) {
      sortedTags[TAG_DICT[tag].index] = tag;
    } else if (sortedTags.length < 18) {
      sortedTags[18] = tag;
    } else {
      sortedTags.push(tag);
    }
  });

  return sortedTags.filter((v) => Boolean(v));
};

type GameTagsProps = {
  tags: string[];
  gameCode: GameCode;
} & SpaceProps;

export function GameTags({ tags, gameCode, ...rest }: GameTagsProps) {
  const { language } = useLanguage();
  const sortedTags = sortTags(tags);

  return (
    <Space wrap {...rest}>
      {sortedTags.map((tag) => (
        <Tag key={`${gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
          {TAG_DICT[tag]?.label[language]}
        </Tag>
      ))}
    </Space>
  );
}
