import { AdminForceNextPhase } from '../../components/admin';
import { Instruction, RankingBoard, Step, Title, translate, Translate } from '../../components';

type StepRankingProps = {
  ranking: any;
  players: Players;
  language: Language;
};

function StepRanking({ ranking, players, language }: StepRankingProps) {
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
      <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
    </Step>
  );
}

export default StepRanking;
