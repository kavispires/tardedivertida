// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { HostNextPhaseButton } from 'components/host';

type StepRankingProps = {
  players: GamePlayers;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: GenericFunction;
};

export function StepRanking({ players, ranking, goToPreviousStep, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Respostas corretos" en="Correct answers" />,
        <Translate
          pt="Primeira resposta correta para uma categoria"
          en="First correct answer for a category"
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
