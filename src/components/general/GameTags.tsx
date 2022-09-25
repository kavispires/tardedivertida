// Ant Design Resources
import { Space, SpaceProps, Tag } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { TAG_DICT } from 'utils/constants';

const sortTags = (tags: string[]) => {
  const SORTED_INDEXES: NumberDictionary = {
    competitive: 0,
    cooperative: 1,
    'same-time': 2,
    'turn-based': 3,
    drawing: 4,
    writing: 5,
    guessing: 6,
    voting: 7,
    pairing: 8,
    'push-your-luck': 9,
    'brain-burner': 10,
    discussion: 11,
    timed: 12,
    traitor: 13,
    images: 14,
    achievements: 15,
    'mobile-friendly': 16,
  };

  const sortedTags: string[] = [];

  tags.forEach((tag) => {
    if (SORTED_INDEXES[tag] !== undefined) {
      sortedTags[SORTED_INDEXES[tag]] = tag;
    } else if (sortedTags.length < Object.keys(SORTED_INDEXES).length) {
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
