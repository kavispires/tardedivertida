import { useMemo } from 'react';
// Ant Design Resources
import { Space, SpaceProps, Tag, Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { TAG_DICT } from 'utils/constants';
// Icons
import { BrainIcon } from 'icons/BrainIcon';
import { CloverIcon } from 'icons/CloverIcon';
import { CompetitiveGameIcon } from 'icons/CompetitiveGameIcon';
import { CooperativeGameIcon } from 'icons/CooperativeGameIcon';
import { DrawingIcon } from 'icons/DrawingIcon';
import { EvaluateIcon } from 'icons/EvaluateIcon';
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
import { ImageCardsIcon } from 'icons/ImageCardsIcon';
import { MedalIcon } from 'icons/MedalIcon';
import { PuzzleIcon } from 'icons/PuzzleIcon';
import { RobotIcon } from 'icons/RobotIcon';
import { SmartphoneIcon } from 'icons/SmartphoneIcon';
import { TalkIcon } from 'icons/TalkIcon';
import { ThinkingIcon } from 'icons/ThinkingIcon';
import { TimerIcon } from 'icons/TimerIcon';
import { TogetherGameIcon } from 'icons/TogetherGameIcon';
import { TraitorIcon } from 'icons/TraitorIcon';
import { TurnBasedGameIcon } from 'icons/TurnBasedGameIcon';
import { VoteIcon } from 'icons/VoteIcon';
import { WritingIcon } from 'icons/WritingIcon';
// Sass
import './GameTags.scss';

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

const icons: Dictionary<any> = {
  competitive: CompetitiveGameIcon,
  cooperative: CooperativeGameIcon,
  'same-time': TogetherGameIcon,
  'turn-based': TurnBasedGameIcon,
  drawing: DrawingIcon,
  writing: WritingIcon,
  guessing: ThinkingIcon,
  voting: VoteIcon,
  pairing: EvaluateIcon,
  'push-your-luck': CloverIcon,
  'brain-burner': BrainIcon,
  discussion: TalkIcon,
  timed: TimerIcon,
  traitor: TraitorIcon,
  images: ImageCardsIcon,
  betting: GamblingChipIcon,
  achievements: MedalIcon,
  bots: RobotIcon,
  'mobile-friendly': SmartphoneIcon,
  puzzle: PuzzleIcon,
};

type GameTagsProps = {
  tags: string[];
  gameCode: GameCode;
} & SpaceProps;

export function GameTags({ tags, gameCode, ...rest }: GameTagsProps) {
  const { language } = useLanguage();

  const { buttonTags, otherTags } = useMemo(() => {
    const sortedTags = sortTags(tags);

    const buttonTags = sortedTags.filter((tag) => icons[tag]);

    const otherTags = sortedTags.filter((tag) => !icons[tag]);

    return { buttonTags, otherTags };
  }, [tags]);

  return (
    <Space wrap {...rest} direction="vertical">
      <div className="game-tags-group">
        {buttonTags.map((tag) => {
          const Icon = icons[tag];

          return (
            <Tooltip key={`${gameCode}-${tag}`} title={TAG_DICT[tag]?.label[language]}>
              <Icon style={{ width: 36 }} className="game-tags-group__icon" />
            </Tooltip>
          );
        })}
      </div>

      {otherTags.map((tag) => (
        <Tag key={`${gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
          {TAG_DICT[tag]?.label[language]}
        </Tag>
      ))}
    </Space>
  );
}
