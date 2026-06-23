import clsx from 'clsx';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { Button, Space, type SpaceProps } from 'antd';
// Types
import type { MonsterImageData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useGlobalState } from '@hooks/useGlobalState';
// Components
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
// Sass
import styles from './MonsterCard.module.scss';

type MonsterCardProps = SpaceProps & {
  /**
   * The current monster to display
   */
  currentMonster: MonsterImageData;
  /**
   * Flag to show or hide orientation control buttons
   */
  showControls?: boolean;
  /**
   * Custom width for the monster card
   */
  cardWidth?: number;
};

/**
 * Displays a monster card with optional orientation controls
 */
export function MonsterCard({ currentMonster, showControls = true, cardWidth, ...props }: MonsterCardProps) {
  const [monsterOrientation, setMonsterOrientation] = useGlobalState('monsterOrientation');
  const defaultCardWidth = useCardWidth(5, { gap: 16, maxWidth: 360 });

  useEffectOnce(() => {
    if (currentMonster.orientation === 'horizontal') {
      setMonsterOrientation(currentMonster.orientation);
    }
  });

  const onChangeOrientation = () => {
    const newOrientation = monsterOrientation === 'vertical' ? 'horizontal' : 'vertical';
    setMonsterOrientation(newOrientation);
  };

  return (
    <Space
      orientation="vertical"
      align="center"
      {...props}
    >
      <ImageCard
        classic
        cardId={currentMonster.id}
        cardWidth={cardWidth || defaultCardWidth}
        className={clsx(
          styles.monsterCard,
          monsterOrientation === 'vertical' ? styles.monsterCardVertical : styles.monsterCardHorizontal,
        )}
      />
      {showControls && (
        <Button onClick={onChangeOrientation}>
          {monsterOrientation === 'vertical' ? <RotateRightOutlined /> : <RotateLeftOutlined />}
          <Translate
            pt="Girar"
            en="Rotate"
          />
        </Button>
      )}
    </Space>
  );
}
