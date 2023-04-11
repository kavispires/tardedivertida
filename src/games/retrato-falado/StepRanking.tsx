import { Button, Space } from 'antd';
import { VIPNextPhaseButton } from 'components/vip';
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
        <Translate pt="Votou com o grupo" en="Voted with the group" />,
        <Translate pt="Votado pela testemunha" en="Voted by the witness" />,
      ]}
    >
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <VIPNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
