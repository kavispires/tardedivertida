import clsx from 'clsx';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Button, Space, SpaceProps } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { ImageCard } from 'components/cards';
import { Translate } from 'components/language';
// Sass
import './MonsterCard.scss';

interface MonsterCardProps extends SpaceProps {
  currentMonster: Monster;
  showControls?: boolean;
  cardWidth?: number;
}

export function MonsterCard({ currentMonster, showControls = true, cardWidth, ...props }: MonsterCardProps) {
  const [monsterOrientation, setMonsterOrientation] = useGlobalState('monsterOrientation');
  const defaultCardWidth = useCardWidth(5, 16, 120, 360);

  useEffectOnce(() => {
    if (currentMonster.orientation === 'horizontal') {
      setMonsterOrientation(currentMonster.orientation);
    }
  });

  const onChangeOrientation = () => {
    const newOrientation = monsterOrientation === 'vertical' ? 'horizontal' : 'vertical';
    setMonsterOrientation(newOrientation);
  };

  const baseClass = 'monster-card';
  return (
    <Space direction="vertical" align="center" {...props}>
      <ImageCard
        imageId={currentMonster.id}
        cardWidth={cardWidth || defaultCardWidth}
        className={clsx(
          baseClass,
          monsterOrientation === 'vertical' ? `${baseClass}--vertical` : `${baseClass}--horizontal`
        )}
      />
      {showControls && (
        <Button onClick={onChangeOrientation}>
          {monsterOrientation === 'vertical' ? <RotateRightOutlined /> : <RotateLeftOutlined />}
          <Translate pt="Girar" en="Rotate" />
        </Button>
      )}
    </Space>
  );
}