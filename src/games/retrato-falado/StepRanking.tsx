// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';

type StepRankingProps = {
  ranking: any;
  players: GamePlayers;
  round: GameRound;
  goToPreviousStep: UseStep['goToPreviousStep'];
};

export function StepRanking({ ranking, players, round, goToPreviousStep }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate key="1" pt="Mais votado" en="Most votes" />,
        <Translate key="2" pt="Recebeu pelo menos 1 voto" en="Got at least 1 vote" />,
        <Translate key="3" pt="Pontos da testemunha" en="Witness points" />,
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
