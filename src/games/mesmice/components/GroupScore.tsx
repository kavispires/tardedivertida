// Ant Design Resources
import { StarFilled } from '@ant-design/icons';
import { Divider } from 'antd';
// Components
import { FixedMenuButton } from '@components/buttons/FixedMenuButton';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

type GroupScoreProps = {
  groupScore: number;
  playerScore: number;
};

export function GroupScore({ groupScore, playerScore }: GroupScoreProps) {
  return (
    <FixedMenuButton
      type="popover"
      position={0}
      icon={<StarFilled />}
      content={
        <Surface>
          <Translate
            pt="Pontuação do Grupo"
            en="Group Score"
          />
          <br />
          <PointsHighlight
            value={groupScore}
            omitText
          />
          <Divider />
          <Translate
            pt="Sua pontuação"
            en="Group Score"
          />
          <br />
          <PointsHighlight
            value={playerScore}
            omitText
          />
        </Surface>
      }
      label={
        <Translate
          pt="Pontos"
          en="Score"
        />
      }
    />
  );
}
