import { useEffect } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Button, Space, SpaceProps } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth, useGlobalState } from 'hooks';
// Components
import { ImageCard, Translate } from 'components';

interface MonsterCardProps extends SpaceProps {
  currentMonster: Monster;
  showControls?: boolean;
}

export function MonsterCard({ currentMonster, showControls = true, ...props }: MonsterCardProps) {
  const [monsterOrientation, setMonsterOrientation] = useGlobalState('monsterOrientation');
  const cardWidth = useCardWidth(5, 16, 120, 360);

  useEffect(() => {
    if (currentMonster.orientation === 'horizontal') {
      setMonsterOrientation(currentMonster.orientation);
    }
  }, []); // eslint-disable-line

  const onChangeOrientation = () => {
    const newOrientation = monsterOrientation === 'vertical' ? 'horizontal' : 'vertical';
    setMonsterOrientation(newOrientation);
  };

  const baseClass = 'r-monster-card';
  return (
    <Space direction="vertical" align="center" {...props}>
      <ImageCard
        imageId={currentMonster.id}
        cardWidth={cardWidth}
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
