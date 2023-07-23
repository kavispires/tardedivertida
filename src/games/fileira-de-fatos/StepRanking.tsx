// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Instruction } from 'components/text';
import { VIPNextPhaseButton } from 'components/vip';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: GenericFunction;
  roundType: string;
};

export function StepRanking({ players, ranking, goToPreviousStep, round, roundType }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Posições corretas" en="Correct positions" />,
        <Translate pt="Penalidade em rodadas especiais" en="Penalty in special rounds" />,
        <Translate pt="Bonus por acertar todos" en="Bonus points for getting all correct" />,
      ]}
    >
      <Instruction contained>
        <Translate
          pt={
            <>
              Acertar todos os cenários da rodada dá <PointsHighlight>2 pontos bônus</PointsHighlight>.
            </>
          }
          en={
            <>
              Matching all scenarios in the round gives <PointsHighlight>2 bonus points</PointsHighlight>.
            </>
          }
        />
        <br />
        <RoundTypeExplanation roundType={roundType} />
      </Instruction>

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <VIPNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
