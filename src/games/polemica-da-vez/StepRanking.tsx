// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { UseStep } from 'hooks/useStep';
// Components
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { HostNextPhaseButton } from 'components/host';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
  isLastRound?: boolean;
};

export function StepRanking({ players, ranking, goToPreviousStep, round, isLastRound }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[<Translate pt="Escolha correta ou próxima" en="Correct or close guess" />]}
    >
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
