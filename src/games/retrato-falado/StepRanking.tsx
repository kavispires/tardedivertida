// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';

type StepRankingProps = {
  ranking: any;
  players: GamePlayers;
  round: GameRound;
  goToPreviousStep: GenericFunction;
};

export function StepRanking({ ranking, players, round, goToPreviousStep }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Mais votado" en="Most votes" />,
        <Translate pt="Recebeu pelo menos 1 voto" en="Got at least 1 vote" />,
        <Translate pt="Pontos da testemunha" en="Witness points" />,
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
