// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { AdminNextPhaseButton } from 'components/admin';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Instruction } from 'components/text';

type StepRankingProps = {
  ranking: GameRanking;
  players: GamePlayers;
  goToPreviousStep: GenericFunction;
  round: GameRound;
  lastRound?: boolean;
};

export function StepRanking({ ranking, players, goToPreviousStep, round, lastRound }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          pt={<>Pontos por já estar no Time Vencedor.</>}
          en={<>Points for already being on the Winning Team.</>}
        />,
        <Translate
          pt={<>Pontos por entrar no Time Vencedor.</>}
          en={<>Points for joining the Winning Team.</>}
        />,
      ]}
    >
      <Instruction contained>
        <Translate
          pt="Somente jogadores na área VIP são ranqueados, porque você não pode ganhar se não estiver lá!"
          en="Only players in the VIP area can be ranked since you can't win if you're not there"
        />
      </Instruction>
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <AdminNextPhaseButton round={round} lastRound={lastRound} />
    </StepRankingWrapper>
  );
}
