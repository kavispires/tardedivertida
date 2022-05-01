// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { ScoringRule } from './components/RulesBlobs';
import { RankingBoard } from 'components/ranking';
import { AdminNextRoundButton } from 'components/admin';

type StepRankingProps = {
  players: GamePlayers;
  playerCount: number;
  round: GameRound;
  ranking: GameRanking;
  goToPreviousStep: GenericFunction;
  isLastRound?: boolean;
};

export function StepRanking({
  players,
  playerCount,
  ranking,
  goToPreviousStep,
  round,
  isLastRound,
}: StepRankingProps) {
  return (
    <Step fullWidth>
      <Title>Ranking</Title>
      <Instruction contained>
        <Translate
          pt="Distribuição de pontos: Votos corretos | Votos recebidos | Penalidade se ninguém acertou a sua dica"
          en="Points Distribution: Correct guesses | Received votes | Penalty for nobody getting your clue correctly"
        />
      </Instruction>

      <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

      <RankingBoard ranking={ranking} players={players} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <AdminNextRoundButton round={round} lastRound={isLastRound} />
    </Step>
  );
}
