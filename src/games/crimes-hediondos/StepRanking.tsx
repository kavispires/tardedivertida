// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { AdminNextPhaseButton } from 'components/admin';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  goToPreviousStep: GenericFunction;
  round: GameRound;
  lastRound?: boolean;
};

export function StepRanking({ ranking, players, goToPreviousStep, round, lastRound }: StepRankingProps) {
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
      <AdminNextPhaseButton round={round} lastRound={lastRound} />
    </StepRankingWrapper>
  );
}
