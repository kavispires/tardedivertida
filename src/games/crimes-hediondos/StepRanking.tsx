// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import { GameRanking, GameRound } from 'types/game';
import { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  goToPreviousStep: UseStep['goToPreviousStep'];
  round: GameRound;
};

export function StepRanking({ ranking, players, goToPreviousStep, round }: StepRankingProps) {
  const roundPoints = round.total - round.current + 1;

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          pt={<>Pares corretos ganham {roundPoints} pontos nessa rodada. 1 ponto a menos na próxima.</>}
          en={<>Correct pairs get {roundPoints} points this round. 1 point less next round.</>}
        />,
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
