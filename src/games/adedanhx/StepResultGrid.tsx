// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { AdedanhxGrid, AnswerGridEntry, GroupAnswerEvaluationEntry } from './utils/types';
import { AnswersGrid } from './components/Grid';
import { ScoringRule } from './components/RulesBlobs';

type StepResultGridProps = {
  players: GamePlayers;
  user: GamePlayer;
  grid: AdedanhxGrid;
  answersGrid: Record<string, AnswerGridEntry>;
  answersGroups: GroupAnswerEvaluationEntry[];
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepResultGrid({
  grid,
  players,
  answersGrid,
  answersGroups,
  goToNextStep,
  announcement,
}: StepResultGridProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Resultado</>} en={<>Results</>} />
      </StepTitle>

      <RuleInstruction type="rule">
        <ScoringRule />
      </RuleInstruction>

      <AnswersGrid grid={grid} answersGrid={answersGrid} answersGroups={answersGroups} players={players} />

      <Space className="space-container" align="center">
        <TimedButton duration={25} icon={<TrophyOutlined />} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
