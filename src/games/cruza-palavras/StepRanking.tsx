// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { ScoringRule } from './components/RulesBlobs';
import { StepRankingWrapper } from 'components/ranking';
import { VIPNextPhaseButton } from 'components/vip';

type StepRankingProps = {
  players: GamePlayers;
  playerCount: number;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: GenericFunction;
};

export function StepRanking({ players, playerCount, ranking, goToPreviousStep, round }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Votos corretos" en="Correct guesses" />,
        <Translate pt="Votos recebidos" en="Received votes" />,
        <Translate
          pt="Penalidade se ninguém acertou a sua dica"
          en="Penalty for nobody getting your clue correctly"
        />,
      ]}
    >
      <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <VIPNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
