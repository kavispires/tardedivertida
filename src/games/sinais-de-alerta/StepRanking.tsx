// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';

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
      gainedPointsDescriptions={[
        <Translate pt="Pares corretos" en="Correct matches" />,
        <Translate pt="Pontos por seu desenho" en="Points for your drawing" />,
      ]}
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
