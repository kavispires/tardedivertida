// Ant Design Resources
import { Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { AdedanhxGrid, AnswerGridEntry } from './utils/types';
import type { UseStep } from 'hooks/useStep';
// Components
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AnswersGrid } from './components/Grid';
import { TimedButton } from 'components/buttons';
import { ScoringRule } from './components/RulesBlobs';

type StepResultGridProps = {
  players: GamePlayers;
  user: GamePlayer;
  grid: AdedanhxGrid;
  answersGrid: Record<string, AnswerGridEntry>;
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepResultGrid({
  grid,
  players,
  answersGrid,
  goToNextStep,
  announcement,
}: StepResultGridProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>Resultado</>} en={<>Results</>} />
      </Title>

      <RuleInstruction type="rule">
        <ScoringRule />
      </RuleInstruction>

      <AnswersGrid grid={grid} answersGrid={answersGrid} players={players} />

      <Space className="space-container" align="center">
        <TimedButton duration={25} icon={<TrophyOutlined />} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
