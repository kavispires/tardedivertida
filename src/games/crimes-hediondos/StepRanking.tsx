// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { AdminNextPhaseButton } from 'components/admin';
import { Translate } from 'components/language';
import { RankingBoard } from 'components/ranking';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

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
    <Step fullWidth>
      <Title>Ranking</Title>
      <Instruction contained>
        <Translate
          pt={<>Pares corretos ganham {roundPoints} pontos nessa rodada. 1 ponto a menos na próxima.</>}
          en={<>Correct pairs get {roundPoints} points this round. 1 point less next round.</>}
        />
      </Instruction>

      <RankingBoard ranking={ranking} players={players} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <AdminNextPhaseButton round={round} lastRound={lastRound} />
    </Step>
  );
}
