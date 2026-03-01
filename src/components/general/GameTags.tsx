import { useMemo } from 'react';
// Ant Design Resources
import { Space, type SpaceProps, Tag, Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { TAG_DICT } from 'utils/constants';
// Icons
import { BrainIcon } from 'icons/BrainIcon';
import { CloverIcon } from 'icons/CloverIcon';
import { AudienceIcon, PlayerDropIcon, SoundEffectsIcon } from 'icons/collection';
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
import styles from './GameTags.module.scss';

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

const icons: Dictionary<React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
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
  puzzle: PuzzleIcon,
  // Technical Features
  achievements: MedalIcon,
  audience: AudienceIcon,
  bots: RobotIcon,
  'mobile-friendly': SmartphoneIcon,
  'player-drop': PlayerDropIcon,
  'sound-effects': SoundEffectsIcon,
};

type GameMechanicTagsProps = {
  mechanics?: string[];
  features?: string[];
  gameCode: GameCode;
} & SpaceProps;

export function GameTags({ mechanics = [], features = [], gameCode, ...rest }: GameMechanicTagsProps) {
  const { language } = useLanguage();

  const { mechanicButtonTags, mechanicOtherTags, featureButtonTags, featureOtherTags } = useMemo(() => {
    const sortedMechanics = sortTags(mechanics);
    const sortedFeatures = sortTags(features);

    const mechanicButtonTags = sortedMechanics.filter((tag) => icons[tag]);
    const mechanicOtherTags = sortedMechanics.filter((tag) => !icons[tag]);

    const featureButtonTags = sortedFeatures.filter((tag) => icons[tag]);
    const featureOtherTags = sortedFeatures.filter((tag) => !icons[tag]);

    return { mechanicButtonTags, mechanicOtherTags, featureButtonTags, featureOtherTags };
  }, [mechanics, features]);

  return (
    <Space
      wrap
      {...rest}
      className={styles.gameTagsContainer}
    >
      {/* Mechanics Section */}
      <div className={styles.gameTagsSection}>
        {mechanicButtonTags.length > 0 && (
          <div className={styles.gameTagsGroup}>
            {mechanicButtonTags.map((tag) => {
              const Icon = icons[tag];

              return (
                <Tooltip
                  key={`${gameCode}-${tag}`}
                  title={TAG_DICT[tag]?.label[language]}
                >
                  <Icon
                    style={{ width: 36 }}
                    className={styles.gameTagsGroupIcon}
                  />
                </Tooltip>
              );
            })}
          </div>
        )}

        {mechanicOtherTags.map((tag) => (
          <Tag
            key={`${gameCode}-${tag}`}
            color={TAG_DICT[tag]?.color}
            style={{ marginRight: 6 }}
          >
            {TAG_DICT[tag]?.label[language]}
          </Tag>
        ))}
      </div>

      {/* Features Section */}
      {(featureButtonTags.length > 0 || featureOtherTags.length > 0) && (
        <div className={styles.gameTagsSection}>
          {featureButtonTags.length > 0 && (
            <div className={styles.gameTagsGroup}>
              {featureButtonTags.map((tag) => {
                const Icon = icons[tag];

                return (
                  <Tooltip
                    key={`${gameCode}-${tag}`}
                    title={TAG_DICT[tag]?.label[language]}
                  >
                    <Icon
                      style={{ width: 36 }}
                      className={styles.gameTagsGroupIcon}
                    />
                  </Tooltip>
                );
              })}
            </div>
          )}

          {featureOtherTags.map((tag) => (
            <Tag
              key={`${gameCode}-${tag}`}
              color={TAG_DICT[tag]?.color}
              style={{ marginRight: 6 }}
            >
              {TAG_DICT[tag]?.label[language]}
            </Tag>
          ))}
        </div>
      )}
    </Space>
  );
}
