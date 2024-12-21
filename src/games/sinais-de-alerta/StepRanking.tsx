// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
// Hooks

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  onGoBack: () => void;
};

export function StepRanking({ players, ranking, onGoBack, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate key="1" pt="Pares corretos" en="Correct matches" />,
        <Translate key="2" pt="Pontos por seu desenho" en="Points for your drawing" />,
      ]}
    >
      <Space className="space-container" align="center">
        <Button onClick={onGoBack}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
