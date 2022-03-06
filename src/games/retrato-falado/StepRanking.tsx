import { AdminNextRoundButton } from 'components/admin';
import { Instruction, RankingBoard, Step, Title, Translate } from 'components';

type StepRankingProps = {
  ranking: any;
  players: Players;
  round: GameRound;
};

export function StepRanking({ ranking, players, round }: StepRankingProps) {
  return (
    <Step fullWidth>
      <Title>Ranking</Title>
      <Instruction contained>
        <Translate
          pt="Distribuição de pontos: Mais votado | Votou com o grupo | Votado pela testemunha"
          en="Points Distribution: Most votes | Voted with the group | Voted by the witness"
        />
      </Instruction>

      <RankingBoard ranking={ranking} players={players} />
      <AdminNextRoundButton round={round} />
    </Step>
  );
}
