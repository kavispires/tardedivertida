// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { AdminNextPhaseButton } from 'components/admin';
import { PopoverRule } from 'components/rules';
import { ScoringRules } from './components/RulesBlobs';

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
        <Translate pt="Escolha correta ou próxima" en="Correct or close guess" />,
        <Translate pt="Pontos do Medium" en="Psychic points" />,
      ]}
    >
      <PopoverRule content={<ScoringRules />} />
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <AdminNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
