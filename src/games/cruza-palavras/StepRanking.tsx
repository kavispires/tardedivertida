// Ant Design Resources
import { Button } from 'antd';
// Components
import {
  AdminNextRoundButton,
  ButtonContainer,
  Instruction,
  PopoverRule,
  RankingBoard,
  Step,
  Title,
  Translate,
} from 'components';
import { ScoringRule } from './RulesBlobs';

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

      <ButtonContainer>
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </ButtonContainer>
      <AdminNextRoundButton round={round} lastRound={isLastRound} />
    </Step>
  );
}
