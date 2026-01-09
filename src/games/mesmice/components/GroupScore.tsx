// Ant Design Resources
import { StarFilled } from '@ant-design/icons';
import { Divider } from 'antd';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Instruction } from 'components/text';

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
        <Instruction>
          <Translate
            pt="Pontuação do Grupo"
            en="Group Score"
          />
          <br />
          <PointsHighlight>{groupScore}</PointsHighlight>
          <Divider />
          <Translate
            pt="Sua pontuação"
            en="Group Score"
          />
          <br />
          <PointsHighlight>{playerScore}</PointsHighlight>
        </Instruction>
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
