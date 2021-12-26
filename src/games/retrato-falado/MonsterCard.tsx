import clsx from 'clsx';
// Design Resources
import { Button, Space } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth, useGlobalState } from '../../hooks';
// Components
import { ImageCard } from '../../components/cards';
import { Monster } from './retrato-falado';

type MonsterCardProps = {
  currentMonster: Monster;
  showControls?: boolean;
};

function MonsterCard({ currentMonster, showControls = true }: MonsterCardProps) {
  const [monsterOrientation, setMonsterOrientation] = useGlobalState('monsterOrientation');
  const cardWidth = useCardWidth(5, 16, 120, 360);

  const onChangeOrientation = () => {
    const newOrientation = monsterOrientation === 'vertical' ? 'horizontal' : 'vertical';
    setMonsterOrientation(newOrientation);
    setMonsterOrientation(newOrientation);
  };

  const baseClass = 'r-monster-card';
  return (
    <Space direction="vertical" align="center">
      <ImageCard
        imageId={currentMonster.id}
        cardWidth={cardWidth}
        className={clsx(
          baseClass,
          monsterOrientation === 'vertical' ? `${baseClass}--vertical` : `${baseClass}--horizontal`
        )}
      />
      {showControls && (
        <Button onClick={onChangeOrientation} shape="circle">
          {monsterOrientation === 'vertical' ? <RotateRightOutlined /> : <RotateLeftOutlined />}
        </Button>
      )}
    </Space>
  );
}

export default MonsterCard;
